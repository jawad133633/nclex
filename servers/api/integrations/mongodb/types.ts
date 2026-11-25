export type MongoClient = Readonly<{
  connect: (uri: string) => Promise<unknown>;
  disconnect: () => Promise<void>;
}>;

export type MongoDbIntegration = Readonly<{
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getCollection: <T extends Record<string, unknown>>(name: string) => mongoose.mongo.Collection<T>;
}>;
import type mongoose from "mongoose";

