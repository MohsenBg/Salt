export enum ValidateOptions {
  NONE = "NONE",
  OK = "OK",
  BAD = "BAD",
}
export enum InputsNames {
  EMAIL_INPUT = "EMAIL_INPUT",
  FULL_NAME = "FULL_NAME",
  USERNAME = "USERNAME",
  PASSWORD = "PASSWORD",
}

export interface UsersOnline {
  username: string;
  socketId: string;
}
