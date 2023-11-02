import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z, WORLD_HEIGHT, WORLD_SIZE, device } from "../settings";
import { mat4 } from "gl-matrix";
import { cameraUniformBuffer } from "./camera";
import { Game } from "../handlers/game";
import { noise } from "../algorithms/perlin";
import { cube, marching } from "../algorithms/chunk/vbo"
import { marching_cubes } from "../algorithms/chunk/marching_cubes";
import { Material } from "../base/material";


export class Chunk {
    _blocks: number[][][];
    _coordinates: number[];
    
    _uniformBuffer: GPUBuffer
    _bindGroup: GPUBindGroup

    _vbo: Float32Array | undefined
    _vboBuffer: GPUBuffer | undefined

    constructor(blocks: Array<Array<Array<number>>>, coordinates: Array<number>) {
        this._blocks = blocks;
        this._coordinates = coordinates;

        this._uniformBuffer = device.createBuffer({
            size: 32, // using 16*2 but would be ideal use 24
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        device.queue.writeBuffer(this._uniformBuffer, 0, new Int32Array(coordinates)) // Int64

        this._bindGroup = device.createBindGroup({
            layout: baseBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: cameraUniformBuffer } }, // camera shared between objects
                { binding: 1, resource: { buffer: this._uniformBuffer } },
                { binding: 2, resource: grass_texture.view },
                { binding: 3, resource: grass_texture.sampler },
                { binding: 4, resource: rock_texture.view },
                { binding: 5, resource: rock_texture.sampler }
            ]
        });
    }

    static createChunk(coordinates: Array<number>) {
        const blocks: number[][][] = [];
        for(let x=0; x<CHUNK_SIZE_X; ++x) {
            blocks.push(new Array());
            for(let y=0; y<CHUNK_SIZE_Y; ++y) {
                blocks[x].push(new Array());
                for(let z=0; z<CHUNK_SIZE_Z; ++z) {
                    blocks[x][y].push(noise.perlin3(
                        (CHUNK_SIZE_X*coordinates[0]+x)/(CHUNK_SIZE_X*WORLD_SIZE),
                        (CHUNK_SIZE_Y*coordinates[1]+y)/(CHUNK_SIZE_Y*WORLD_HEIGHT),
                        (CHUNK_SIZE_Z*coordinates[2]+z)/(CHUNK_SIZE_Z*WORLD_SIZE)));
                }
            }
        }
        return new Chunk(blocks,coordinates);
    }

    static getChunk(file: File) {
        // TODO
    }

    load() {
        this._vbo = marching_cubes(this);

        this._vboBuffer = device.createBuffer({
            size: this._vbo.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        device.queue.writeBuffer(this._vboBuffer, 0, this._vbo);
    }

}

const VertexShader = await fetch("/shaders/chunk/vertex.wgsl").then(resolve => resolve.text());
const FragmentShader = await fetch("/shaders/chunk/fragment.wgsl").then(resolve => resolve.text());

const baseBindGroupLayout = device.createBindGroupLayout({
    entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {} }
    ]
});

const basePipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [baseBindGroupLayout]
});

export const pipeline = device.createRenderPipeline({
    layout: basePipelineLayout,
    vertex: {
        entryPoint: "main",
        module: device.createShaderModule({ code: VertexShader }),
        buffers: [{
            arrayStride: 24,
            attributes: [
                { format: "float32x3", offset:  0, shaderLocation: 0 },
                { format: "float32x3", offset: 12, shaderLocation: 1 },
            ],
        }]
    },
    fragment: {
        entryPoint: "main",
        module: device.createShaderModule({ code: FragmentShader }),
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
    },
    depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: true,
        depthCompare: "less"
    },
    primitive: {
        frontFace: "ccw",
        cullMode: "none",
    }
})

const grass_texture = new Material();
await grass_texture.initialize("/assets/grass.jpg");

const rock_texture = new Material();
await rock_texture.initialize("/assets/rock_2.jpg");