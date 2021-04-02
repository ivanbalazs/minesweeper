export default class {
    constructor(index, size, mine = false) {
        this.index = index;
        this.size = size;
        this.mine = mine;
        this.neighboringMines = 0;
        this.flagged = false;
        this.revealed = false;
    }

    get row() {
        return Math.floor(this.index / this.size);
    }

    get col() {
        return this.index % this.size;
    }

    get neighbors() {
        let ret = [];
        for (let row = Math.max(this.row - 1, 0); row <= Math.min(this.row + 1, this.size - 1); row++) {
            for (let col = Math.max(this.col - 1, 0); col <= Math.min(this.col + 1, this.size - 1); col++) {
                if (row !== this.row || col !== this.col) {
                    ret.push(row * this.size + col);
                }
            }
        }
        return ret;
    }

    get correctlyFlagged() {
        return this.mine && this.flagged;
    }
}
