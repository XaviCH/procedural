import { Player } from "../data/player";
import { pipeline } from "../data/chunk";
import { World } from "../data/world";
import { device } from "../settings";
import { Mouse } from "./mouse";
import { cameraUniformBuffer } from "../data/camera";
import { mat4 } from "gl-matrix";
import { noise } from "../algorithms/perlin";
import { keyboard } from "./keyboard";

export class Game{

    world: World
    context: any
    canvas: HTMLCanvasElement
    player: Player
    seed: number
    date: number
    cicles: number
    
    last_date: number
    last_cicles: number

    static instance(): Game {
        return _instance;
    }

    setup(canvas: HTMLCanvasElement, seed: number) {
        this.seed = seed;
        noise.seed(seed);
        this.canvas = canvas;
        this.context = canvas.getContext("webgpu");
        this.context.configure({
            device: device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied",
        });
        this.world = new World();
        this.player = new Player();

        this.world.load();
        this.date = Date.now();
        this.cicles = 0;

        this.last_date = this.date;
    }

    run() {
        this._update();
        this._render();
        requestAnimationFrame(() => this.run());

    }

    _update() {
        
        const date = Date.now();
        if (date - this.last_date > 1000) {
            console.log(`FPS: ${this.cicles}`);
            this.cicles = 0;
            this.last_date = date;
        }
        
        const delta = date - this.date;
        this.date = date;
        this.cicles += 1;

        device.queue.writeBuffer(cameraUniformBuffer, 0, mat4.perspective(mat4.create(), Math.PI/6, this.canvas.getBoundingClientRect().width/this.canvas.getBoundingClientRect().height, 0.1, 500));
        Mouse.instance().update();
        keyboard.update(delta);

        this.world.update(delta);
        this.player.update(delta);
    }


    _render() {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: { r: 1, g: 0, b: 0, a: 0 },
                storeOp: "store",
            }],
            depthStencilAttachment: {
                view: device.createTexture({
                    size: [this.canvas.width, this.canvas.height, 1],
                    format: "depth24plus",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT
                }).createView(),
                depthLoadOp: 'clear',
                depthClearValue: 1.0,
                depthStoreOp: "store",
            }
        });

        pass.setPipeline(pipeline);
        
        this.world.chunks.forEach(chunks => 
            chunks.forEach(chunks => 
                chunks.forEach(chunk => {
                    if (!chunk._vbo?.length) return;
                    pass.setBindGroup(0, chunk._bindGroup);
                    pass.setVertexBuffer(0, chunk._vboBuffer);
                    pass.draw(chunk._vbo.length/6);
        })));
        
        pass.end();
        device.queue.submit([encoder.finish()]);
    }

}

const _instance: Game = new Game();