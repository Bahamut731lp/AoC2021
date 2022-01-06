const input = await Deno.readTextFile("./input.txt");

let instructions: string[] = [];
let matrix: boolean[][] = [];

input.split("\n").forEach((element: string) => {
    if (!element.trim()) return;

    if (element.includes("fold")) {
        instructions.push(element.trim());
        return;
    };

    const [x, y] = element.trim().split(",");

    if (!matrix[Number(y)]) matrix[Number(y)] = [];
    matrix[Number(y)][Number(x)] = true;
});

let firstFold;

for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    const axis = instruction.split("=")!.shift()!.split("")!.pop();
    const coord = Number(instruction.split("=")!.pop());

    const y = matrix.length;
    const x = Math.max(...matrix.map(v => v?.length).filter(v => Number(v) != NaN));

    const folded: boolean[][] = [];

    for (let row = 0; row < y; row++) {
        for (let column = 0; column < x; column++) {
            const element = matrix?.[row]?.[column];
            if (!element) continue;
            
            let foldedY = row;
            let foldedX = column;

            
            if (axis == "y" && row >= coord) foldedY = coord - (row - coord);
            if (axis == "x" && column >= coord) foldedX = coord - (column - coord);

            if (!folded[foldedY]) folded[foldedY] = [];
            folded[foldedY][foldedX] = element;
        }
    }

    matrix = folded;
    if (i == 0) {
        firstFold = matrix.map(v => v?.filter(Number).length).reduce((acc, v) => { return acc += v }, 0);
    }
}

console.log(`Part 1: ${firstFold}`);
console.log("Part 2:");
console.table(matrix.map((v: boolean[], i: number) => {
    return new Array(v.length).fill(".").map((a: string, j: number) => {
        if (v[j]) return "#"
        return "."
    });
}));