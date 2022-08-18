import { Message } from "./message.ts";
import { Self } from "./types.ts";

export interface Action {
  action: string;
  // deno-lint-ignore ban-types
  params: object;
  echo?: string;
  self?: Self;
}

export function send_private_msg(
  user_id: string,
  message: Message,
  echo?: string,
  self?: Self,
): Action {
  return {
    action: "send_message",
    params: {
      detail_type: "private",
      user_id: user_id,
      message: message,
      self: self,
    },
    echo: echo,
    self: self,
  };
}
