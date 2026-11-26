import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import type { Logger } from "@workspace/logging";
import type { MongoClient, MongoDbIntegration } from "./types.js";

type MongoDbIntegrationDependencies = Readonly<{
  uri?: string;
  logger: Logger;
  client?: MongoClient;
}>;

const mongooseClient: MongoClient = Object.freeze({
  connect: (uri: string): Promise<unknown> => mongoose.connect(uri),
  disconnect: (): Promise<void> => mongoose.disconnect()
});

const inMemoryStores = new Map<string, Map<string, Record<string, unknown>>>();

const getInMemoryStore = (name: string) => {
  let store = inMemoryStores.get(name);
  if (!store) {
    store = new Map<string, Record<string, unknown>>();
    inMemoryStores.set(name, store);
  }
  return store;
};

const createInMemoryCollection = <T extends Record<string, unknown>>(name: string): mongoose.mongo.Collection<T> => {
  const store = getInMemoryStore(name);

  return {
    find: (filter: Record<string, unknown> = {}, _options: Record<string, unknown> = {}) => {
      const getFiltered = () => {
        const items = Array.from(store.values());
        if (!filter || Object.keys(filter).length === 0) return items;
        return items.filter((item) => {
          return Object.entries(filter).every(([key, value]) => {
            if (value && typeof value === "object" && "$exists" in value) {
              const shouldExist = Boolean((value as { $exists: boolean }).$exists);
              const exists = item[key] !== undefined;
              return exists === shouldExist;
            }
            return item[key] === value;
          });
        });
      };

      const result = {
        sort: (_sortCriteria?: unknown) => ({
          toArray: async () => getFiltered() as unknown as T[],
          limit: (_n: number) => ({ toArray: async () => getFiltered() as unknown as T[] })
        }),
        limit: (_n: number) => ({
          toArray: async () => getFiltered() as unknown as T[]
        }),
        toArray: async () => getFiltered() as unknown as T[]
      };
      return result as unknown as ReturnType<mongoose.mongo.Collection<T>["find"]>;
    },
    findOne: async (filter: Record<string, unknown> = {}) => {
      for (const item of store.values()) {
        const matches = Object.entries(filter).every(([key, value]) => {
          if (value && typeof value === "object" && "$exists" in value) {
            const shouldExist = Boolean((value as { $exists: boolean }).$exists);
            return (item[key] !== undefined) === shouldExist;
          }
          return item[key] === value;
        });
        if (matches) return item as unknown as T;
      }
      return null;
    },
    insertOne: async (doc: T) => {
      const id = (doc as any)._id ?? (doc as any).id ?? randomUUID();
      const record = { ...doc, _id: id };
      store.set(String(id), record as Record<string, unknown>);
      return { insertedId: id, acknowledged: true };
    },
    updateOne: async (filter: Record<string, unknown>, update: Record<string, unknown>, options?: { upsert?: boolean }) => {
      let targetId: string | null = null;
      for (const [id, item] of store.entries()) {
        const matches = Object.entries(filter).every(([k, v]) => item[k] === v);
        if (matches) {
          targetId = id;
          break;
        }
      }
      if (targetId) {
        const existing = store.get(targetId)!;
        const set = (update.$set as Record<string, unknown>) ?? {};
        const unset = (update.$unset as Record<string, unknown>) ?? {};
        const updated = { ...existing, ...set };
        for (const k of Object.keys(unset)) delete updated[k];
        store.set(targetId, updated);
        return { matchedCount: 1, modifiedCount: 1, acknowledged: true, upsertedId: null, upsertedCount: 0 };
      }
      if (options?.upsert) {
        const id = randomUUID();
        const set = (update.$set as Record<string, unknown>) ?? {};
        store.set(id, { ...filter, ...set, _id: id });
        return { matchedCount: 0, modifiedCount: 0, acknowledged: true, upsertedId: id as any, upsertedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0, acknowledged: true, upsertedId: null, upsertedCount: 0 };
    },
    findOneAndUpdate: async (filter: Record<string, unknown>, update: Record<string, unknown>) => {
      for (const [id, item] of store.entries()) {
        const matches = Object.entries(filter).every(([k, v]) => item[k] === v);
        if (matches) {
          const set = (update.$set as Record<string, unknown>) ?? {};
          const updated = { ...item, ...set };
          store.set(id, updated);
          return updated as unknown as T;
        }
      }
      return null;
    },
    deleteMany: async (filter: Record<string, unknown> = {}) => {
      let count = 0;
      for (const [id, item] of Array.from(store.entries())) {
        const matches = Object.entries(filter).every(([k, v]) => item[k] === v);
        if (matches) {
          store.delete(id);
          count += 1;
        }
      }
      return { deletedCount: count, acknowledged: true };
    },
    deleteOne: async (filter: Record<string, unknown> = {}) => {
      for (const [id, item] of Array.from(store.entries())) {
        const matches = Object.entries(filter).every(([k, v]) => item[k] === v);
        if (matches) {
          store.delete(id);
          return { deletedCount: 1, acknowledged: true };
        }
      }
      return { deletedCount: 0, acknowledged: true };
    },
    countDocuments: async (filter: Record<string, unknown> = {}) => {
      if (!filter || Object.keys(filter).length === 0) return store.size;
      let count = 0;
      for (const item of store.values()) {
        const matches = Object.entries(filter).every(([key, value]) => {
          if (value && typeof value === "object" && "$exists" in value) {
            const shouldExist = Boolean((value as { $exists: boolean }).$exists);
            return (item[key] !== undefined) === shouldExist;
          }
          return item[key] === value;
        });
        if (matches) count += 1;
      }
      return count;
    },
    createIndex: async () => "index_ok"
  } as unknown as mongoose.mongo.Collection<T>;
};

export const createMongoDbIntegration = ({
  uri,
  logger,
  client = mongooseClient
}: MongoDbIntegrationDependencies): MongoDbIntegration => {
  if (!uri) {
    return Object.freeze({
      connect: (): Promise<void> => {
        logger.info("MongoDB connection is not configured; running in seamless memory-backed mode.");
        return Promise.resolve();
      },
      disconnect: (): Promise<void> => Promise.resolve(),
      isConnected: (): boolean => false,
      getCollection: <T extends Record<string, unknown>>(name: string): mongoose.mongo.Collection<T> => {
        return createInMemoryCollection<T>(name);
      }
    });
  }

  return Object.freeze({
    connect: async (): Promise<void> => {
      try {
        await client.connect(uri);
        logger.info("MongoDB connection established.");
      } catch (err) {
        logger.warn("Could not connect to MongoDB URI; running in seamless memory-backed mode.", { error: String(err) });
      }
    },
    disconnect: async (): Promise<void> => {
      try {
        await client.disconnect();
      } catch {
        // ignore disconnect errors
      }
    },
    isConnected: (): boolean => mongoose.connection.readyState === 1,
    getCollection: <T extends Record<string, unknown>>(name: string): mongoose.mongo.Collection<T> => {
      if (mongoose.connection.readyState === 1) {
        return mongoose.connection.collection<T>(name);
      }
      return createInMemoryCollection<T>(name);
    }
  });
};
