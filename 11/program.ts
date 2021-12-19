//Načtení dat ze souboru
const input = await Deno.readTextFile("./sample.txt");

let data = input.trim().split("\n").map(v => v.trim().split("").map(n => parseInt(n)));
const flashedMaskTemplate: boolean[][] = new Array(data.length).fill(new Array(data[0].length).fill(false));

let flashCounter = 0;
let flashedMask = flashedMaskTemplate;

const exists = (x: number, y: number) => {
    return !!data?.[x]?.[y];
}

const flash = (x: number, y: number) => {
    data[x][y] = 0;
    flashedMask[x][y] = true;
    flashCounter += 1;

    const rozdily = [
        [1, 0], 
        [1, 1], 
        [0, 1], 
        [-1, 1], 
        [-1, 0], 
        [-1 -1], 
        [0, -1],
        [1, -1]
    ];

    for (let okoli = 0; okoli < rozdily.length; okoli++) {
        const delty = rozdily[okoli];
        const deltaX = delty.pop() || 0;
        const deltaY = delty.pop() || 0;

        if (exists(x + deltaX, y + deltaY)) {
            data[x + deltaX][y + deltaY] += 1;
        };
    }

}

for (let step = 0; step < 100; step++) {
    //Resetování masky pro probliknuté chobotničky
    flashedMask = flashedMaskTemplate;

    //Zvednutí hodnoty energie chobotniček o 1
    for (let row = 0; row < data.length; row++) {
        for (let octopus = 0; octopus < data[row].length; octopus++) {
            data[row][octopus] += 1;
        }
    }

    //Proč do samostatného loopu?
    //Potřebuji totiž, aby začali blikat až v moment, co je celá matice zvětšena o 1
    for (let row = 0; row < data.length; row++) {
        for (let octopus = 0; octopus < data[row].length; octopus++) {
            if (data[row][octopus] > 9) flash(row, octopus);
        }
    }

    await Deno.writeTextFile("./file.txt", `${JSON.stringify(data)}\n`, { append: true });
}

console.log(flashCounter);