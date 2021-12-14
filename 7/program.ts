//Načtení dat ze souboru a rozdělení do pole čísel podle řárek
const input = await Deno.readTextFile("./input.txt");
const data = input.split(",").map(v => parseInt(v.trim()));

/*
    PART 1
*/
const palivoNaPozici: number[] = [];

for (let pozice = 0; pozice < data.length; pozice++) {
    let palivo = 0;
    for (let index = 0; index < data.length; index++) {
        palivo += Math.abs(data[pozice] - data[index]);
    }

    palivoNaPozici.push(palivo);
}

const nejmensiCena = Math.min(...palivoNaPozici);
console.log(nejmensiCena);

/*
    PART 2
*/

const palivoNaPozici2: number[] = [];
const max = Math.max(...data);

for (let index = 0; index < max; index++) {
    let palivo = 0;

    for (let pozice = 0; pozice < data.length; pozice++) {      
        const pocetKroku = Math.abs(data[pozice] - index);
        if (pocetKroku == 0) continue;
        
        palivo += ((pocetKroku * (pocetKroku + 1)) / 2);
    }

    palivoNaPozici2.push(palivo);
}

const nejmensiCena2 = Math.min(...palivoNaPozici2);
console.log(nejmensiCena2);