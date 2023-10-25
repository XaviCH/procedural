import { vec3 } from "gl-matrix";
import { Face, Mesh, Vertex } from "../../base/mesh";


/*
    Implemented just for triangles
*/
function wavefront(data: string) {
    const mesh = new Mesh();

    const normals: number[][] = [];
    const lines = data.split(/[\r\n]+/g); // TDO use a buffer

    lines.forEach(line => {
        const items = line.trim().split(" ");
        const op = items[0];
        if (op === "v") { // reading a vertex line
            mesh.vertices.push(new Vertex([parseFloat(items[1]), parseFloat(items[2]), parseFloat(items[3])]));
        } else if (op === "vn") { // reading a normal line
            normals.push([parseFloat(items[1]), parseFloat(items[2]), parseFloat(items[3])]);
        } else if (op === "f") { // reading a face line
            const vertexA = items[1].split("/");
            const vertexB = items[2].split("/");
            const vertexC = items[3].split("/");

            if (vertexA[2] === vertexB[2] && vertexB[2] === vertexC[2]) { // normal of the face

                mesh.faces.push(new Face([
                    mesh.vertices[parseInt(vertexA[0])-1],
                    mesh.vertices[parseInt(vertexB[0])-1],
                    mesh.vertices[parseInt(vertexC[0])-1],
                    ],
                    normals[parseInt(vertexA[2])-1]
                ))

            } else { // normal of the vertices
                const A = mesh.vertices[parseInt(vertexA[0])-1];
                A.normal = vec3.clone(normals[parseInt(vertexA[2])-1]);

                const B = mesh.vertices[parseInt(vertexB[0])-1];
                B.normal = vec3.clone(normals[parseInt(vertexB[2])-1]);

                const C = mesh.vertices[parseInt(vertexC[0])-1];
                C.normal = vec3.clone(normals[parseInt(vertexC[2])-1]);

                mesh.faces.push(new Face(
                    [A,B,C],
                    normals[parseInt(vertexA[2])-1]
                ));
            }

        }
    });

    return mesh;
}