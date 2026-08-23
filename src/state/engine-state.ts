export interface EngineState {
  status: "stopped" | "started";
  animationId: number | undefined;
}

export const engineStates = new Map<number, EngineState>();
