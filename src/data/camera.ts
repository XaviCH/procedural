import { mat4 } from "gl-matrix";
import { device } from "../settings";

export const cameraUniformBuffer = device.createBuffer({
    size: 64*2+32, // using 32*3 but would be ideal use 64*3
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
});

export const projection = mat4.perspective(mat4.create(), Math.PI/4, 1, 0.1, 500);
export const view = mat4.lookAt(mat4.create(), [-1.0,1.0,-1.0], [0,0,0], [0,1,0]);

device.queue.writeBuffer(cameraUniformBuffer, 0, projection);
device.queue.writeBuffer(cameraUniformBuffer, 64, view);
device.queue.writeBuffer(cameraUniformBuffer, 128, new Int32Array([0,0,0])) // Int64

