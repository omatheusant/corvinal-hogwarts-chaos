export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export const IDLE_STATE: ActionState = null;

export function errorState(message: string, fieldErrors?: Record<string, string[]>): ActionState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): ActionState {
  return { status: "success", message };
}
