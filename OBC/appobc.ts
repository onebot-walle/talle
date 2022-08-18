import { Action, Resp, Self } from "../mod.ts";

export class BotMap {
  bots: Map<Self, WebSocketConnection[]>;
  conns: Map<WebSocketConnection, Self[]>;
  constructor() {
    this.bots = new Map();
    this.conns = new Map();
  }
}

export class AppOBC {
  seq: number;
  bot_map: BotMap;
  echo_map: Record<string, (r: Resp) => void>;
  constructor() {
    this.seq = 0;
    this.bot_map = new BotMap();
    this.echo_map = {};
  }
  next_echo(): string {
    this.seq += 1;
    return `${this.seq}`;
  }
  call_action(action: Action, _msgpack = false): Promise<Resp> | void {
    if (action.self) {
      const conns = this.bot_map.bots.get(action.self);
      if (conns) {
        const conn = conns[0];
        return new Promise((resolve, reject) => {
          const echo = this.next_echo();
          this.echo_map[echo] = resolve;
          setTimeout(() => {
            delete this.echo_map[echo];
            reject(new Error("timeout"));
          }, 30000);
          conn.writable.getWriter().write(JSON.stringify(action));
        });
      }
    }
  }
}
