import Bingo from "./bingo.ts";

//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");
const data = input.split("\n");

//Naparsování řady čísel, která se bude postupně odškrtávat na kartičkách
const radaCisel = data.shift()?.trim().split(",")?.map(v => parseInt(v));

//Data si překopíruju do další proměnný, abych neměnil ta původní, kdybych je náhodou potřeboval
//Jednotlivé karty (plochy) si ukládám do pole polí
const zdrojovaData = data;
const hraciPlochy = [];

//Naparsování jednotlivých karet
//Vždycky to zhltne pět řádků naráz
while (zdrojovaData.length != 0) {
    const radek = zdrojovaData.shift();

    if (radek == "") {
        const plocha = [];
        for (let index = 0; index < 5; index++) {
            plocha.push(zdrojovaData.shift()?.trim()?.split(/\s+/gi)?.map(v => parseInt(v)));
        }

        hraciPlochy.push(plocha)
    }
}

//Zde si budu odkládat objekty s daty o jednotlivých kartách
const historie = [];

//Odehraju partii u každé karty
//U každé karty si poznamenám, kolik tahů trvala hra a jaké je její skóre
for (let index = 0; index < hraciPlochy.length; index++) {
    const plocha = hraciPlochy[index];
    const bingo = new Bingo(5, ...plocha as number[][]);

    let pocetTahu = 0;

    for (const cislo of radaCisel as number[]) {
        bingo.oznacCislo(cislo);

        if (bingo.vyhrana) {
            historie[index] = {
                pocetTahu,
                skore: bingo.skore
            }

            break;
        }

        pocetTahu++;
    }
}

//Tohle by šlo udělat rovnou v té smyčce nahoře
//Pro pořádek mi to ale připadá lepší udělat tady
//Navíc to není na nejnáročnější smyčka v tomhle souboru, že...
let minimum = historie[0];
let maximum = historie[0];

for (const zaznam of historie) {
    minimum = zaznam.pocetTahu < minimum.pocetTahu ? zaznam : minimum;
    maximum = zaznam.pocetTahu > maximum.pocetTahu ? zaznam: maximum;
}

console.table({Prvni: minimum, Posledni: maximum});