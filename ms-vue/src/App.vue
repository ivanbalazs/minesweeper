<template>
    <div id="app">
        <form @submit.prevent="generateArea">
            Size: <input type="number" size="2" :min="3" v-model="size">
            Mines: <input type="number" size="2" min="1" :max="size * size - 1" v-model="mineCnt">
            <p><input type="submit" value="Generate"></p>
        </form>
        <template v-if="fields">
            <!--<p>Mines ({{ mineCnt }}): {{ mines }}</p>-->
            <p>Flagged: {{ flaggedCnt }}</p>
            <div id="field" :class="[{ failed }]" :style="`width:${30 * size + 29}px`">
                <template v-for="(field, i) in fields">
                    <div :key="i" :class="[{ revealed: field.revealed, last: i === lastRevealed  }]">
                        <button
                            v-if="!field.revealed"
                            :class="[{ flagged: field.flagged }]"
                            :disabled="failed"
                            @click.right.prevent="flag(field)"
                            @click="check(field)"
                        >
                            <!--<span class="index">{{ field.index }}</span>-->
                            <span v-if="field.flagged">🚩</span>
                        </button>
                        <template v-else>{{ field.mine ? '💣' : field.neighboringMines || '&nbsp;' }}</template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import Field from './Field';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const sizes = [5, 8, 10, 15];

export default {
    data() {
        return {
            sizes,
            size: 8,
            mineCnt: 5,
            fields: null,
            mines: null,
            failed: false,
            lastRevealed: null,
        };
    },
    computed: {
        fieldCnt() {
            return Math.pow(this.size, 2);
        },
        flaggedCnt() {
            return this.fields.filter(f => f.flagged).length;
        },
        complete() {
            const len = cond => this.fields.filter(cond).length;
            const mineCnt = +this.mineCnt
            return mineCnt === len(f => f.flagged) && mineCnt === len(f => f.correctlyFlagged);
        },
    },
    created() {
        console.clear();
        this.generateArea();
    },
    methods: {
        generateArea() {
            if (!this.size || !this.mineCnt || this.mineCnt < 1) {
                return alert("Can't do..");
            }
            const mines = new Set();
            do {
                mines.add(getRandomInt(0, this.fieldCnt));
            } while (mines.size < this.mineCnt);
            this.mines = [ ...mines ].sort((a, b) => a - b);
            this.fields = new Array(this.fieldCnt).fill().map((_, i) => new Field(i, this.size, mines.has(i)));
            this.failed = false;
        },
        flag(field) {
            field.flagged = !field.flagged;
            if (this.complete) {
                this.win();
            }
        },
        check(field) {
            this.lastRevealed = field.index;
            if (field.mine) {
                return this.fail();
            }
            if (this.complete) {
                return this.win();
            }
            this.revealField(field);
        },
        revealField(field) {
            if (field.revealed) {
                return;
            }
            const neighbors = field.neighbors;
            field.neighboringMines = neighbors.reduce((cnt, i) => this.fields[i].mine ? cnt + 1 : cnt, 0);
            field.revealed = true;
            field.flagged = false;
            if (field.neighboringMines === 0) {
                neighbors.forEach(i => this.revealField(this.fields[i]));
            }
        },
        revealMines() {
            this.fields.forEach(f => {
                if (f.mine) {
                    f.revealed = true;
                }
            });
        },
        fail() {
            this.revealMines();
            this.failed = true;
        },
        win() {
            alert('Yaay! You did it!');
            this.generateArea();
        },
    },
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

#field {
    display: flex;
    flex-flow: wrap;
    margin: 0 auto;

    &.failed {
        div.last {
            background-color: red;
        }
    }

    div {
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        padding: 1px;

        &.revealed {
            padding-top: 5px;
        }

        button {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0;
            border: 1px solid #ccc;
            border-radius: 3px;
            line-height: 30px;

            &.flagged {
                background-color: yellow;
                font-size: 1.2em;
            }

            .index {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 10px;
            }
        }
    }
}
</style>
