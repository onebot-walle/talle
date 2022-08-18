import { as_request, text } from "../mod.ts";

const p = Deno.readFileSync("./test/event/request.json");
const decoder = new TextDecoder("utf-8");
const event = JSON.parse(decoder.decode(p));
console.log(as_request(event));

const t = text("OneBot");
console.log(JSON.stringify(t));
