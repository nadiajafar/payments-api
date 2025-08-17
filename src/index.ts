import { buildApp } from "./app.js";
const app = buildApp();

app.listen({ port: 3000, host: "0.0.0.0" })
  .then(() => app.log.info("payments-api listening on :3000"))
  .catch(err => { app.log.error(err); process.exit(1); });
