//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");
const data = input.split("\n").map((string) => parseInt(string));

/*
    PART 1
*/
//Vypočtení, kolikrát hodnota vzrostla oproti té minulé
const pocetRustu = data.reduce((akumulator, hodnota, index, pole) => {
    if (index == 0) return akumulator; //Pokud je to první měření, nemá smysl nic porovnávat
    if (hodnota > pole[index - 1]) return akumulator += 1; //Pokud je aktuální hodnota vyšší než ta minulá, inkrementuje se akumulátor

    return akumulator; //V ostatních případech se nic nestane
}, 0);

console.log(pocetRustu);


/*
    PART 2
*/
//Pole pro uchování součtů jednotlivých trojic meření
const mericiOkna: number[] = [];

for (let index = 0; index < data.length; index++) {
    //Když už není možné vytvořit další okno, ukonči smyčku
    if (!data[index + 1] && !data[index + 2]) break;

    //Vytvoření nového okna tří měření
    mericiOkna.push(data[index] + data[index + 1] + data[index + 2]);
}

//Vypočtení, kolikrát hodnota vzrostla oproti té minulé
const pocetRustuMereni = mericiOkna.reduce((akumulator, hodnota, index, pole) => {
    if (index == 0) return akumulator;
    if (hodnota > pole[index - 1]) return akumulator += 1;

    return akumulator;
}, 0);

console.log(pocetRustu, pocetRustuMereni);