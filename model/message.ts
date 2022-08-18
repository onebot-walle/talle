export type Message = MessageSegment[];

export interface MessageSegment {
  type: string;
  // deno-lint-ignore ban-types
  data: object;
}

export function text(text: string, extra = {}): MessageSegment {
  return { type: "text", data: Object.assign(extra, { text: text }) };
}
