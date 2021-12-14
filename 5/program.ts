//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");
const data = input.split("\n");

//Pole bodů a jednotlivé matice
//Jedna je pro čáry bez diagonál, druhá s diagonálama
const body = [];
const maticeBezDiagonal: number[][] = [];
const maticeSDiagonalama: number[][] = [];

//Inicializace matic, aby v nich alespoň něco bylo a mohli jsme k nim přistupovat
const size = 1000;
for (let index = 0; index < size; index++) {
    maticeBezDiagonal.push(new Array(size).fill(0, 0, size));
    maticeSDiagonalama.push(new Array(size).fill(0, 0, size));
}

//Řádek po řádku se čtou souřadnice čar a zapisují se do matic
for (const radek of data) {
    const rozdeleni = radek.split("->");

    //Separování na dva body
    const prvniBod = (rozdeleni.shift() as string).split(",");
    const druhyBod = (rozdeleni.pop() as string).split(",");

    //Pro lepší přehlednost si to rozdělím do objektů
    const start = {
        x: parseInt(prvniBod[0]),
        y: parseInt(prvniBod[1])
    }

    const konec = {
        x: parseInt(druhyBod[0]),
        y: parseInt(druhyBod[1])
    }

    const rozdilX = Math.abs(konec.x - start.x);
    const rozdilY = Math.abs(konec.y - start.y);

    //Vykreslení pouze horizontálních či vertikálních čar
    if (start.x == konec.x || start.y == konec.y) {

        if (rozdilX != 0) {
            for (let index = 0; index <= rozdilX; index++) {
                maticeBezDiagonal[start.y][Math.min(start.x, konec.x) + index] += 1;
                maticeSDiagonalama[start.y][Math.min(start.x, konec.x) + index] += 1;
            }
        }

        if (rozdilY != 0) {
            for (let index = 0; index <= rozdilY; index++) {
                maticeBezDiagonal[Math.min(start.y, konec.y) + index][start.x] += 1;
                maticeSDiagonalama[Math.min(start.y, konec.y) + index][start.x] += 1;
            }
        }

        //console.table(maticeBezDiagonal);
    }
    //Vykreslení i teda těch diagonál
    else {
        //Znaménka určují, jestli se bude u souřadnice odečítat nebo odebírat
        //Pokryjí se tím oba směry vykreslování
        const znamenkoX = konec.x - start.x < 0 ? 1 : -1;
        const znamenkoY = konec.y - start.y < 0 ? 1 : -1;

        for (let index = 0; index <= rozdilX; index++) {
            maticeSDiagonalama[konec.y + (znamenkoY * index) ][konec.x + (znamenkoX * index)] += 1;
        }
    }
}

//Výpočet, kolik průsečíků čar je v matici
let pocetKrizeniBezDiagonal = 0;
let pocetKrizeniSDiagonalama = 0;

for (let index = 0; index < maticeBezDiagonal.length; index++) {
    pocetKrizeniBezDiagonal += maticeBezDiagonal[index].filter(val => val > 1).length;
    pocetKrizeniSDiagonalama += maticeSDiagonalama[index].filter(val => val > 1).length;
}

console.log(pocetKrizeniBezDiagonal, pocetKrizeniSDiagonalama);