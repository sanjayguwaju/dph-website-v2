import { getPayload } from "payload";
import config from "./src/payload.config";
async function run() {
  const payload = await getPayload({ config });
  const nav = await payload.findGlobal({ slug: "navigation", depth: 2 });
  console.log(JSON.stringify(nav, null, 2));
  process.exit(0);
}
run();
