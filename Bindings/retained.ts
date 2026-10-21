import type { AutomationEventList, rlRenderBatch } from "./Structs/structs.ts";

// C keeps these JS-backed pointers beyond a single FFI call. Keep strong
// references until they are detached/unloaded; never rely on caller reachability.
export const retained: {
  automation: AutomationEventList | null;
  renderBatch: rlRenderBatch | null;
  music: Map<bigint, Uint8Array<ArrayBuffer>>;
} = {
  automation: null,
  renderBatch: null,
  music: new Map(),
};
