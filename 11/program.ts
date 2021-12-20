//Načtení dat ze souboru
const input = await Deno.readTextFile("./input.txt");

let data = input.trim().split("\n").map(v => v.trim().split("").map(n => parseInt(n)));

let flashCounter = 0;
let flashedOctos = new Set();

const exists = (x: number, y: number) => {
    return (typeof data[x] !== "undefined") && (typeof data[x][y] !== "undefined");
}

const increase = (x: number, y: number) => {
    if (!exists(x, y)) return;
    if (flashedOctos.has(`${x}:${y}`)) return;

    data[x][y]++;
    if (data[x][y] <= 9) return;

    data[x][y] = 0;
    flashedOctos.add(`${x}:${y}`);
    flashCounter++;

    for (let row = -1; row <= 1; row++) {
        for (let column = -1; column <= 1; column++) {
            if (!row && !column) continue;

            increase(x + row, y + column);
        }

    }

}

let step = 0;
while (true) {
    if (step + 1 == 100) {
        console.log(flashCounter);
    }

    step++;
    //Resetování množiny probliknutých chobotniček
    flashedOctos = new Set();

    //Zvednutí hodnoty energie chobotniček o 1
    for (let row = 0; row < data.length; row++) {
        for (let octopus = 0; octopus < data[row].length; octopus++) {
            increase(row, octopus);
        }
    }

    if (flashedOctos.size === (data.length * data[0].length)) {
        console.log(step);
        break;
    };
}