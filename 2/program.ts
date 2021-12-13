//Rozhraní pro objekt souřadnic
interface ISouradnice {
    horizontalni: number,
    hloubka: number,
    smer: number
}

//Výchozí hodnoty souřadnic
const vychoziHodnoty: ISouradnice = {
    horizontalni: 0,
    hloubka: 0,
    smer: 0
}

//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");

/*
    PART 1
 */

//Rozdělení vstupu podle řádků
//Každý řádek se rozdělí podle mezer, následně se vytáhne instrukce a hodnota
//Switch se postará o patřičné operace
const souradnice: ISouradnice = input.split("\n").reduce((vysledek, radek) => {
    const instrukce = radek.trim().split(/\s/gi);

    const klicoveSlovo = instrukce.shift();
    const hodnota = Number(instrukce.shift());
    
    switch (klicoveSlovo) {
        case "forward":
            return {...vysledek, horizontalni: vysledek.horizontalni + hodnota}
        
        case "up":
            return {...vysledek, hloubka: vysledek.hloubka - hodnota}
        
        case "down":
            return {...vysledek, hloubka: vysledek.hloubka + hodnota}

        default:
            return vysledek;
    }
}, vychoziHodnoty);

console.table(souradnice);

/*
    PART 2
*/

//Rozdělení vstupu podle řádků
//Každý řádek se rozdělí podle mezer, následně se vytáhne instrukce a hodnota
//Switch se postará o patřičné operace
const upraveneSouradnice: ISouradnice = input.split("\n").reduce((vysledek, radek) => {
    const instrukce = radek.split(/\s/gi);

    const klicoveSlovo = instrukce.shift();
    const hodnota = Number(instrukce.shift());

    switch (klicoveSlovo) {
        case "forward":
            return {...vysledek, horizontalni: vysledek.horizontalni + hodnota, hloubka: vysledek.hloubka + (vysledek.smer * hodnota)}
        
        case "up":
            return {...vysledek, smer: vysledek.smer - hodnota}
        
        case "down":
            return {...vysledek, smer: vysledek.smer + hodnota}

        default:
            return vysledek;
    }
}, vychoziHodnoty);
console.table(upraveneSouradnice);