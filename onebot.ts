import { Action, Event, Resp, Self, Status } from "./mod.ts";

export class OneBot {
  public ah: ActionHandler;
  public eh: EventHandler;
  constructor(ah: ActionHandler, eh: EventHandler) {
    this.ah = ah;
    this.eh = eh;
  }
  async call_action(action: Action): Promise<Resp> {
    return this.eh.after_call_action(
      await this.ah.call(await this.eh.before_call_action(action)),
    );
  }
  async call_event(event: Event): Promise<void> {
    await this.ah.before_call_event(event);
    this.eh.call(event);
    this.ah.after_call_event();
  }
  start(config: Record<string, unknown> = {}): void {
    this.ah.start(this, config);
    this.eh.start(this, config);
  }
  shutdown(): void {
    this.ah.shutdown();
    this.eh.shutdown();
  }
}

export interface ActionHandler {
  start(ob: OneBot, config: Record<string, unknown>): void;
  before_call_event(event: Event): Promise<Event>;
  call(action: Action): Promise<Resp>;
  after_call_event(): void;
  shutdown(): void;
  get_selfs(): Promise<Self[]>;
  get_status(): Promise<Status>;
}

export interface EventHandler {
  start(ob: OneBot, config: Record<string, unknown>): void;
  before_call_action(action: Action): Promise<Action>;
  call(event: Event): void;
  after_call_action(resp: Resp): Promise<Resp>;
  shutdown(): void;
}
