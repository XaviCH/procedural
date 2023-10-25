class Keyboard {

    down: Set<string> = new Set();
    keys: { keyup: Array<string>; keydown: Array<string>; } ;
    _update: { keyup: Array<string>; keydown: Array<string>; } ;

    constructor() {
        this.keys = {
            keyup: [],
            keydown: [],
        };
        this._update = {
            keyup: [],
            keydown: [],
        };
    }

    update(deltatime: number) {
        this.keys = this._update;
        this._update = {
            keyup: [],
            keydown: [],
        };
    }

}

export const keyboard: Keyboard = new Keyboard();

document.onkeyup = (event: KeyboardEvent) => {
    keyboard._update.keyup.push(event.key);
    console.log(`Key Up: ${event.key}`);
}

document.onkeydown = (event: KeyboardEvent) => {
    keyboard._update.keydown.push(event.key);
    console.log(`Key Down: ${event.key}`);
}
