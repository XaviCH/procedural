// MAP
export let CHUNK_SIZE_X = 16;
export let CHUNK_SIZE_Y = 16;
export let CHUNK_SIZE_Z = 16;
export let WORLD_SIZE = 5;
export let WORLD_HEIGHT = 3;
// PLAYER
export let CURSOR_X = 0.001;
export let CURSOR_Y = 0.001;

if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
}

const adapter = await navigator.gpu.requestAdapter();

if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
}

export const device = await adapter.requestDevice();