export enum KEY { W, A, S, D, SHIFT, CONTROL, SPACE}

const mapKey = {
    "W": KEY.W, "w": KEY.W,
    "A": KEY.A, "a": KEY.A,
    "S": KEY.S, "s": KEY.S,
    "D": KEY.D, "d": KEY.D,
    "Shift": KEY.SHIFT,
    "Control": KEY.CONTROL,
    " ": KEY.SPACE
}


class Keyboard {

    down: Set<KEY> = new Set();

    add(key: string) {
        this.down.add(mapKey[key]);
    }

    remove(key: string) {
        this.down.delete(mapKey[key]);
    }

}

export const keyboard: Keyboard = new Keyboard();

document.onkeyup = (event: KeyboardEvent) => {
    keyboard.remove(event.key);
    console.log(`Key Up: ${event.key}`);
}

document.onkeydown = (event: KeyboardEvent) => {
    keyboard.add(event.key);
    console.log(`Key Down: ${event.key}`);
}
