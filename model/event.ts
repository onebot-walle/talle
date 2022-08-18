import { Self, Status } from "./types.ts";
import { Message } from "./message.ts";

export interface Event {
  id: string;
  time: number;
  type: string;
  detail_type: string;
  sub_type: string;
  self?: Self;
}

export function event_check<T extends Event>(
  event: Event,
  type?: string,
  detail_type?: string,
  sub_type?: string,
  platform?: string,
): T | void {
  if (type === undefined || event.type == type) {
    if (detail_type === undefined || event.detail_type === detail_type) {
      if (sub_type === undefined || event.sub_type === sub_type) {
        if (platform === undefined || event.self?.platform === platform) {
          return event as T;
        }
      }
    }
  }
}

// deno-lint-ignore no-empty-interface
export interface MetaEvent extends Event {}
export function as_meta(event: Event): MetaEvent | void {
  return event_check(event, "meta");
}

export interface MessageEvent extends Event {
  self: Self;
  message_id: string;
  message: Message;
  alt_message: string;
  user_id: string;
}
export function as_message(event: Event): MessageEvent | void {
  return event_check(event, "message");
}

export interface NoticeEvent extends Event {
  self: Self;
}
export function as_notice(event: Event): NoticeEvent | void {
  return event_check(event, "notice");
}

export interface RequestEvent extends Event {
  self: Self;
}
export function as_request(event: Event): RequestEvent | void {
  return event_check(event, "request");
}

export interface HeartbeatEvent extends MetaEvent {
  interval: number;
}
export function as_heartbeat(event: Event): HeartbeatEvent | void {
  return event_check(event, "meta", "heartbeat");
}

export interface StatusUpdateEvent extends MetaEvent, Status {}
export function as_status_update(event: Event): StatusUpdateEvent | void {
  return event_check(event, "meta", "status_update");
}
