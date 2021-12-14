//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");
const data = input.split(",").map(v => parseInt(v.trim()));

const pocetDni = 256;
//Než abychom simulovali věk každé ryby zvlášť, tak se bude uchovávat, kolik je ryb v jakém věku
const vekyRyb = new Array(8).fill(0);

for (let index = 0; index < data.length; index++) {
    const vek = data[index];
    vekyRyb[vek]++;
}

for (let den = 0; den < pocetDni; den++) {
    let kolikNovychRyb = vekyRyb[0];

    for (let i = 1; i < vekyRyb.length; i++) {
        //Věk ryb se posune o jeden doleva
        //Např. z ryby, která je v poli ryb, kterým zbývá 6 dní, se přesune do pole ryb, kterým zbývá 5 dní
        vekyRyb[i - 1] = vekyRyb[i];
    }

    vekyRyb[6] += kolikNovychRyb;
    vekyRyb[8] = kolikNovychRyb;
}

console.log(vekyRyb);
console.log(vekyRyb.reduce((acc, val) => acc + val));