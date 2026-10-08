import "@tanstack/react-start/server-only";
import { setResponseStatus } from "@tanstack/react-start/server";

export function fail(status: number, message: string): never {
  setResponseStatus(status);
  throw new Error(message);
}
