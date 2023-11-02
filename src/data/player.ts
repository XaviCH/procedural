import { mat4, vec3 } from "gl-matrix";
import { cameraUniformBuffer, view } from "./camera";
import { Mouse } from "../handlers/mouse";
import { CURSOR_X, CURSOR_Y, device } from "../settings";
import { KEY, keyboard } from "../handlers/keyboard";

export class Player {
    coords: number[] = [0,0,0]; 
    position: vec3 = vec3.fromValues(2,20,2);
    view: vec3 = vec3.fromValues(-0.5,0,-0.5); 

    update(deltaTime: number) {
        
        const down = keyboard.down
        
        // movement
        const movement = vec3.normalize(vec3.create(),[this.view[0],0,this.view[2]]);
        if (down.has(KEY.W)) {
            vec3.add(this.position,this.position, vec3.mul(vec3.create(),movement,[0.2,0,0.2]));
        }
        if (down.has(KEY.S)) {
            vec3.add(this.position,this.position, vec3.mul(vec3.create(),movement,[-0.2,0,-0.2]));
        }
        if (down.has(KEY.A)) {
            vec3.add(this.position,this.position, vec3.mul(vec3.create(),vec3.rotateY(vec3.create(),movement,[0,0,0],Math.PI/2),[0.2,0,0.2]));
        }
        if (down.has(KEY.D)) {
            vec3.add(this.position,this.position, vec3.mul(vec3.create(),vec3.rotateY(vec3.create(),movement,[0,0,0],Math.PI/2),[-0.2,0,-0.2]));
        }
        if (down.has(KEY.SPACE)) {
            vec3.add(this.position,this.position, [0,0.1,0]);
        }
        if (down.has(KEY.SHIFT)) {
            vec3.add(this.position,this.position, [0,-0.1,0]);
        }
        

        mat4.lookAt(view,vec3.add(vec3.create(),this.position,[10,10,10]), this.position, [0,1,0]);


        device.queue.writeBuffer(cameraUniformBuffer, 64, view);

    }
    
}