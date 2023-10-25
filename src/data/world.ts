import * as settings from "../settings";
import { Chunk, pipeline } from "./chunk";
import { device } from "../settings";


export class World {
    chunks: Chunk[][][];

    constructor() {
        const size = 2*settings.WORLD_SIZE-1;
        const offset = Math.floor(size/2);

        this.chunks = []
        for(let x=0; x<size; ++x) {
            this.chunks.push(new Array);
            for(let y=0; y<settings.WORLD_HEIGHT; ++y) {
                this.chunks[x].push(new Array);
                for(let z=0; z<size; ++z) { 
                    this.chunks[x][y].push(Chunk.createChunk([x-offset,y,z-offset]));
                }
            }
        }
    }

    load() {
        const size = 2*settings.WORLD_SIZE-1;

        for(let x=0; x<size; ++x) {
            for(let y=0; y<settings.WORLD_HEIGHT; ++y) {
                for(let z=0; z<size; ++z) {
                    this.chunks[x][y][z].load();
                }
            }
        }
    }

    getChunk(coordinate: number[]): Chunk | null {
        const offset = this.chunks[0][0][0]._coordinates;
        const size = 2*settings.WORLD_SIZE-1;

        const x = coordinate[0] - offset[0];
        const y = coordinate[1] - offset[1];
        const z = coordinate[2] - offset[2];

        if (x>=size || x<0 || y>=settings.WORLD_HEIGHT || y<0 || z>=size || z<0) return null;
        return this.chunks[x][y][z];
    }

    getChunkNeighbors(chunk: Chunk): Array<Chunk|null> {
        const x = chunk._coordinates[0];
        const y = chunk._coordinates[1];
        const z = chunk._coordinates[2];
        return [
            this.getChunk([x+1,y,z]),
            this.getChunk([x-1,y,z]),
            this.getChunk([x,y+1,z]),
            this.getChunk([x,y-1,z]),
            this.getChunk([x,y,z+1]),
            this.getChunk([x,y,z-1]),
        ]
    }

    update(deltaTime: number) {
    }

}