import { Action, as_message, MessageEvent } from "../mod.ts";
import { Event } from "../mod.ts";
import { Resp } from "../mod.ts";
import { EventHandler, OneBot } from "../onebot.ts";

export class Matchers implements EventHandler {
  inner: Matcher[];
  ob?: OneBot;
  constructor() {
    this.inner = [];
  }
  start(ob: OneBot, _config: Record<string, unknown>): void {
    this.ob = ob;
  }
  // deno-lint-ignore require-await
  async before_call_action(action: Action): Promise<Action> {
    return action;
  }
  call(event: Event): void {
    if (this.ob) {
      const ob = this.ob;
      this.inner.forEach((matcher) => {
        if (matcher.pre_handle(event) !== Signal.NotMatch) {
          const session = new Session(event, ob);
          matcher.call(session);
        }
      });
    }
  }
  // deno-lint-ignore require-await
  async after_call_action(resp: Resp): Promise<Resp> {
    return resp;
  }
  shutdown(): void {
    this.ob = undefined;
  }
}

export class Session<E extends Event> {
  event: E;
  ob: OneBot;
  constructor(event: Event, ob: OneBot) {
    this.event = event as E;
    this.ob = ob;
  }
}

export enum Signal {
  Matched,
  NotMatch,
  MatchAndBlock,
}

export class Matcher {
  pre_handle: (event: Event) => Signal;
  call: <E extends Event>(session: Session<E>) => Promise<void>;
  constructor(
    pre_handle: (event: Event) => Signal,
    call: <E extends Event>(session: Session<E>) => Promise<void>,
  ) {
    this.pre_handle = pre_handle;
    this.call = call;
  }
}

export function on_message(
  handle: (session: Session<MessageEvent>) => Promise<void>,
  pre_handle?: (event: Event) => Signal,
): Matcher {
  return new Matcher((event) => {
    if (as_message(event)) {
      if (pre_handle) {
        return pre_handle(event);
      } else return Signal.Matched;
    } else return Signal.NotMatch;
  }, handle as <E extends Event>(session: Session<E>) => Promise<void>);
}
