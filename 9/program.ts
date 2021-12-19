import HeightMap from "./HeightMap.ts";

//Načtení dat ze souboru a rozdělení do pole čísel podle řádku
const input = await Deno.readTextFile("./sample.txt");
const data = input.trim().split("\n").map(v => v.trim().split("").map(v => parseInt(v)));


/*
    PART 1
*/
const hm = new HeightMap(...data);
const rizika = [];
const indexy = [];

for (let radek = 0; radek < data.length; radek++) {
    for (let sloupec = 0; sloupec < data[radek].length; sloupec++) {
        const bod = hm.bod(radek, sloupec);
        const okoli = hm.okoliBodu(radek, sloupec).filter(v => v != bod);
        
        if (okoli.length > 0 && okoli.every(v => v > bod)) {
            rizika.push(bod + 1);
            indexy.push(`${radek};${sloupec}`);
        }
    }
}

console.log(rizika.reduce((acc, v) => acc + v));

/*
    PART 2
*/
