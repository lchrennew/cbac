import { startServer } from "koa-es-template";
import Index from "./routes/index.js";

await startServer({ index: Index })
