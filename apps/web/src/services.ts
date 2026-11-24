import { createAuth } from "@wrk-live-deseng/auth";
import { createDb } from "@wrk-live-deseng/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
