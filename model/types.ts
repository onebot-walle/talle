export interface Self {
  user_id: string;
  platform: string;
}

export interface Bot {
  online: boolean;
  self: Self;
}

export interface Status {
  good: boolean;
  bots: Bot[];
}
