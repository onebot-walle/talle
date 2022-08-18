export interface Resp {
  status: string;
  retcode: number;
  // deno-lint-ignore no-explicit-any
  data: any;
  message: string;
  echo?: string;
}

export class RespError {
  retcode: number;
  message: string;
  constructor(retcode: number, message: string) {
    this.retcode = retcode;
    this.message = message;
  }
}

export function resp_ok<T>(resp: Resp): T {
  if (resp.status !== "ok") {
    return resp.data as T;
  } else {
    throw new RespError(resp.retcode, resp.message);
  }
}
