//Načtení dat ze souboru a rozdělení do pole čísel podle řádků
const input = await Deno.readTextFile("./input.txt");
const data = input.split("\n").map((radek) => radek.trim().split("").map(v => Number(v)));

const Transpozice = <T>(matice: T[][]) => {

    //Samotné transponování matice
    //Vezme se první řádek matice, ve kterém se budou iterovat prvky => získáváme index sloupce
    //V každém prvku prvního řádku se místo původního prvku objeví pole prvků z řádků na dané pozici
    const transponovanaMatice = matice[0].map((_, indexSloupce) => matice.map((radek, indexRadku) => Number(radek[indexSloupce])));

    return transponovanaMatice;
}

interface IVyskyty {
    pocetJednicek: number;
    pocetNul: number;
}

const PoctyBitu = (matice: number[][]):IVyskyty[] => {
    const vyskyty = matice.map((radek) => {

        //Hledáme počet jedniček v řádku
        //Pokud to je jednička, k výskytu se přičte
        //Nula se sice taky přičte, ale počet výskytu nijak nezmění
        const pocetJednicek = radek.reduce((vyskyt, bit) => vyskyt += bit, 0);

        //Zbytek čísel musí být zákonitě nuly
        //Pokud teda nejsme třístavové TTL, pak by to asi chtělo řešit i stav "odpojeno"...
        //Pro zjednodušení to tak ale nebude :)
        const pocetNul = radek.length - pocetJednicek;

        //Vrátí se objekt reprezentující jednotlivé výskyty boolovských hodnot
        return { pocetJednicek, pocetNul};
    });

    return vyskyty;
}

interface IDiagnostika {
    gamma: number[] | number;
    epsilon: number[] | number;
}

const DiagnostickeMiry = (matice:IVyskyty[], decimalni: boolean = false):IDiagnostika => {
    const gamma: number[] = [];
    const epsilon: number[] = [];

    matice.forEach((vyskyt) => {
        if (vyskyt.pocetJednicek > vyskyt.pocetNul) {
            gamma.push(1);
            epsilon.push(0);
        }
        else {
            gamma.push(0);
            epsilon.push(1);
        }
    })

    //Konverzní fuckery
    //Každé číslo je defaultně pole bitů, to se tedy spojí a vznikne string bitů
    //Ten pomocí funkce parseInt převedu do dekadický.
    //Dvojka v parametru říká, jaká je báze číselné soustavy argumentu
    if (decimalni) return { gamma: parseInt(gamma.join(""), 2), epsilon: parseInt(epsilon.join(""), 2)}
    return { gamma, epsilon }
}

const PodporaZivota = (data: number[][], maticeVyskytu:IVyskyty[]) => {
    let miraTvorbyKysliku = data;
    let miraLikvidaceOxidu = data;

    for (let index = 0; index < data[0].length; index++) {
        
        if (miraTvorbyKysliku.length == 1 && miraLikvidaceOxidu.length == 1) break;

        if (miraTvorbyKysliku.length > 1) {    
            const { pocetJednicek, pocetNul } = PoctyBitu(Transpozice(miraTvorbyKysliku))[index];
            miraTvorbyKysliku = miraTvorbyKysliku.filter((cislo: number[]) => {
                return Number(cislo[index]) == Number(pocetJednicek >= pocetNul);
            });
        }

        if (miraLikvidaceOxidu.length > 1) {
            const { pocetJednicek, pocetNul } = PoctyBitu(Transpozice(miraLikvidaceOxidu))[index];
            
            miraLikvidaceOxidu = miraLikvidaceOxidu.filter((cislo: number[]) => {
                return Number(cislo[index]) == Number(pocetNul > pocetJednicek);
            });
        }
    }

    const tvorbaKysliku = parseInt(miraTvorbyKysliku.flat().join(""), 2);
    const likvidaceOxidu = parseInt(miraLikvidaceOxidu.flat().join(""), 2);

    return { tvorbaKysliku, likvidaceOxidu };
}

const { gamma, epsilon } = DiagnostickeMiry(PoctyBitu(Transpozice(data)), true);
console.table({ gamma, epsilon, spotreba: Number(gamma) * Number(epsilon)});

const { tvorbaKysliku, likvidaceOxidu} = PodporaZivota(data, PoctyBitu(Transpozice(data)))
console.table({ tvorbaKysliku, likvidaceOxidu, podporaZivota: tvorbaKysliku * likvidaceOxidu});