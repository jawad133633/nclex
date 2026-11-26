import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/auth" as any);
}
