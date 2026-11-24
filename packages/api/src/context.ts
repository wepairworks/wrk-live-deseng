import type { Session } from "@wrk-live-deseng/auth";
import type { Database } from "@wrk-live-deseng/db";

export type Context = {
  session: Session | null;
  db: Database;
};
