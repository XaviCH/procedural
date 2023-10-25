import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z } from "../../settings";
import type { Chunk } from "../../data/chunk";
import { Game } from "../../handlers/game";
import { vec3 } from "gl-matrix";

function isABlock(neighbors: Array<Chunk|null>,dir: number, x: number, y: number, z: number): Boolean {
    const chunk = neighbors[dir];
    if(!chunk) return false;
    if (dir===0) return chunk._blocks[0][y][z] > 0;
    if (dir===1) return chunk._blocks[CHUNK_SIZE_X-1][y][z] > 0;
    if (dir===2) return chunk._blocks[x][0][z] > 0;
    if (dir===3) return chunk._blocks[x][CHUNK_SIZE_Y-1][z] > 0;
    if (dir===4) return chunk._blocks[x][y][0] > 0;
    else return chunk._blocks[x][y][CHUNK_SIZE_Z-1] > 0;
}

function getRelativeBlock(neighbors: Array<Chunk|null>, position: number[], direction: number[]): number {
    
    let x = position[0] + direction[0];
    let y = position[1] + direction[1];
    let z = position[2] + direction[2];

    const chunk = neighbors[(Math.floor(x/CHUNK_SIZE_X)+1)*9+(Math.floor(y/CHUNK_SIZE_Y)+1)*3+(Math.floor(z/CHUNK_SIZE_Z)+1)];
    if(!chunk) return 0;
    
    function mod(a: number, b: number) {
        return ((a % b) + b) % b
    }

    return chunk._blocks[mod(x,CHUNK_SIZE_X)][mod(y,CHUNK_SIZE_Y)][mod(z,CHUNK_SIZE_Z)]
}

function getChunkNeighbors(chunk: Chunk): Array<Chunk|null> {
    const world = Game.instance().world;

    const x = chunk._coordinates[0];
    const y = chunk._coordinates[1];
    const z = chunk._coordinates[2];

    const chunks: Array<Chunk|null> = []
    for(let i=-1; i<2; ++i) {
        for(let j=-1; j<2; ++j) {
            for(let k=-1; k<2; ++k) {
                if (i===0 && j===0 && k===0) chunks.push(chunk);
                chunks.push(world.getChunk([x+i,y+j,z+k]));
            }
        }
    }
    return chunks;
}

export function cube(chunk: Chunk): Float32Array {
    const neighbors: Array<Chunk|null> = Game.instance().world.getChunkNeighbors(chunk);
    
    let vbo: number[] = []

    for(let x=0; x<CHUNK_SIZE_X; ++x) {
        for(let y=0; y<CHUNK_SIZE_Y; ++y) {
            for(let z=0; z<CHUNK_SIZE_Z; ++z) {
                const block = chunk._blocks[x][y][z];
                if (block <= 0) continue;
                // Generate RIGHT
                if (x === CHUNK_SIZE_X-1 && !isABlock(neighbors,0,x,y,z) || x !== CHUNK_SIZE_X-1 && chunk._blocks[x+1][y][z] <= 0) {
                    vbo = vbo.concat([
                        x+1,y+1,z+1,1,0,0,
                        x+1,y+0,z+1,1,0,0,
                        x+1,y+1,z+0,1,0,0,

                        x+1,y+0,z+0,1,0,0,
                        x+1,y+0,z+1,1,0,0,
                        x+1,y+1,z+0,1,0,0,
                    ])
                }
                // Generate LEFT
                if (x === 0 && !isABlock(neighbors,1,x,y,z) || x !== 0 && chunk._blocks[x-1][y][z] <= 0) {
                    vbo = vbo.concat([
                        x+0,y+1,z+1,-1,0,0,
                        x+0,y+0,z+1,-1,0,0,
                        x+0,y+1,z+0,-1,0,0,

                        x+0,y+0,z+0,-1,0,0,
                        x+0,y+0,z+1,-1,0,0,
                        x+0,y+1,z+0,-1,0,0,
                    ])
                }
                // Generate TOP
                if (y === CHUNK_SIZE_Y-1 && !isABlock(neighbors,2,x,y,z) || y !== CHUNK_SIZE_Y-1 && chunk._blocks[x][y+1][z] <= 0) {
                    vbo = vbo.concat([
                        x+1,y+1,z+1,0,1,0,
                        x+0,y+1,z+1,0,1,0,
                        x+1,y+1,z+0,0,1,0,

                        x+0,y+1,z+0,0,1,0,
                        x+0,y+1,z+1,0,1,0,
                        x+1,y+1,z+0,0,1,0,
                    ])
                }
                // Generate BOTTON
                if (y === 0 && !isABlock(neighbors,3,x,y,z) || y !== 0 && chunk._blocks[x][y-1][z] <= 0) {
                    vbo = vbo.concat([
                        x+1,y+0,z+1,0,-1,0,
                        x+0,y+0,z+1,0,-1,0,
                        x+1,y+0,z+0,0,-1,0,

                        x+0,y+0,z+0,0,-1,0,
                        x+0,y+0,z+1,0,-1,0,
                        x+1,y+0,z+0,0,-1,0,
                    ])
                }
                // Generate FRONT
                if (z === CHUNK_SIZE_Z-1 && !isABlock(neighbors,4,x,y,z) || z !== CHUNK_SIZE_Z-1 && chunk._blocks[x][y][z+1] <= 0) {
                    vbo = vbo.concat([
                        x+1,y+1,z+1,0,0,1,
                        x+0,y+1,z+1,0,0,1,
                        x+1,y+0,z+1,0,0,1,

                        x+0,y+0,z+1,0,0,1,
                        x+0,y+1,z+1,0,0,1,
                        x+1,y+0,z+1,0,0,1,
                    ])
                }
                // Generate BACK
                if (z === 0 && !isABlock(neighbors,5,x,y,z) || z !== 0 && chunk._blocks[x][y][z-1] <= 0) {
                    vbo = vbo.concat([
                        x+1,y+1,z+0,0,0,-1,
                        x+0,y+1,z+0,0,0,-1,
                        x+1,y+0,z+0,0,0,-1,

                        x+0,y+0,z+0,0,0,-1,
                        x+0,y+1,z+0,0,0,-1,
                        x+1,y+0,z+0,0,0,-1,
                    ])
                }
            }
        }
    }

    return new Float32Array(vbo);
}

//https://developer.nvidia.com/gpugems/gpugems3/part-i-geometry/chapter-1-generating-complex-procedural-terrains-using-gpu
export function marching(chunk: Chunk) {
    const neighbors: Array<Chunk|null> = getChunkNeighbors(chunk);
    const position: number[][] = [
        [0,0,0],
        [0,0,1],
        [0,1,0],
        [0,1,1],
        [1,0,0],
        [1,0,1],
        [1,1,0],
        [1,1,1]
    ]
    const density = (x: number, y: number, z: number, r: number, s: number, t: number) => {
        const blocks = chunk._blocks;

        return                          blocks[x][y][z] + getRelativeBlock(neighbors,[x,y,z],[0,0,t]) +
            getRelativeBlock(neighbors,[x,y,z],[0,s,0]) + getRelativeBlock(neighbors,[x,y,z],[0,s,t]) +
            getRelativeBlock(neighbors,[x,y,z],[r,0,0]) + getRelativeBlock(neighbors,[x,y,z],[r,0,t]) +
            getRelativeBlock(neighbors,[x,y,z],[r,s,0]) + getRelativeBlock(neighbors,[x,y,z],[r,s,t]);
    }
    function connected(v1: number, v2: number): Boolean {
        const p1 = position[v1];
        const p2 = position[v2];
        return Math.abs(p1[0]-p2[0]) + Math.abs(p1[1]-p2[1]) + Math.abs(p1[2]-p2[2]) === 1;
    }


    let vbo: number[] = [];
    for(let x=0; x<CHUNK_SIZE_X; ++x) {
        for(let y=0; y<CHUNK_SIZE_Y; ++y) {
            for(let z=0; z<CHUNK_SIZE_Z; ++z) {
                const block: number = chunk._blocks[x][y][z];

                const vertices = [
                    density(x,y,z,-1,-1,-1)/8,
                    density(x,y,z,-1,-1, 1)/8,
                    density(x,y,z,-1, 1,-1)/8,
                    density(x,y,z,-1, 1, 1)/8,
                    density(x,y,z, 1,-1,-1)/8,
                    density(x,y,z, 1,-1, 1)/8,
                    density(x,y,z, 1, 1,-1)/8,
                    density(x,y,z, 1, 1, 1)/8,
                ]
                const sign = Math.sign(block);

                for(let v1=0; v1<8; ++v1) {
                    if (Math.sign(vertices[v1]) != sign) for(let v2=v1+1; v2<8; ++v2) {
                        if (Math.sign(vertices[v2]) != sign && connected(v1,v2)) for(let v3=v2+1; v3<8; ++v3) {
                            if (Math.sign(vertices[v3]) != sign && connected(v1,v3) && connected(v2,v3)) {
                                const d1 = 1-Math.abs(vertices[v1])
                                const d2 = 1-Math.abs(vertices[v2])
                                const d3 = 1-Math.abs(vertices[v3])
                                const p1 = vec3.add([0,0,0],position[v1],[d1,d1,d1]);
                                const p2 = vec3.add([0,0,0],position[v2],[d2,d2,d2]);
                                const p3 = vec3.add([0,0,0],position[v3],[d3,d3,d3]);
                                
                                const normal: number[] = [0,0,0];
                                vec3.normalize(normal,vec3.add(normal,vec3.add(normal,p1,p2),p3));
                                if (sign <= 0) vec3.negate(normal,normal);
                                vbo = vbo.concat(
                                    [x+p1[0], y+p1[1], z+p1[2]], normal,
                                    [x+p2[0], y+p2[1], z+p2[2]], normal,
                                    [x+p3[0], y+p3[1], z+p3[2]], normal,
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    return new Float32Array(vbo);

}


