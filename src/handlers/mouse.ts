
export class Mouse {
    position: number[] | null = null
    direction: number[] | null = null

    static instance() {
        return _instance;
    }

    update() {
        if (mouse_on_screen) {
            this.direction = [last_position[0] - this.position[0], last_position[1] - this.position[1]];
            this.position = [last_position[0], last_position[1]];
        }
    }
}

const _instance: Mouse = new Mouse();

const last_position: number[] = [0,0]
let mouse_on_screen = false;


document.onmousemove = (event: MouseEvent) => {
    last_position[0] = event.pageX;
    last_position[1] = event.pageY;
}

document.onmouseleave = (event: MouseEvent) => {
    mouse_on_screen = false
    _instance.position = null;
    _instance.direction = null;
}

document.onmouseenter = (event: MouseEvent) => {
    mouse_on_screen = true
    _instance.position = [event.pageX, event.pageY];
    _instance.direction = [0,0];
}