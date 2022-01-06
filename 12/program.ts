//Načtení dat ze souboru
//https://github.com/sk1talets/advent-of-code/blob/main/2021/12/script.js
const input = await Deno.readTextFile("./input.txt");

const MAPA: { [key: string]: string[] } = {};

input.trim().split("\n").forEach((cesta: string) => {
    const [x, y] = cesta.trim().split("-");
    
    MAPA[x] ? MAPA[x].push(y) : MAPA[x] = [y];
    MAPA[y] ? MAPA[y].push(x) : MAPA[y] = [x];
});

const jeMala = (destinace: string) => {
    return destinace.match(/^[a-z]+$/);
}

const najdiCestu = (start: string, cil: string, cesty: Object[] = [], trasa: { [key: string]: number | boolean } = {}) => {
    trasa[start] = Number(trasa[start]) + 1 || 1;

    if (jeMala(start) && trasa[start] === 2) {
        trasa['small cave visited twice'] = true;
    }

    if (start === cil) {
        cesty.push(trasa);
        return;
    }

    if (!MAPA[start]) {
        return;
    }

    for (const x of MAPA[start]) {
        if (jeMala(x) && x in trasa) {
            //continue;

            if (['start', 'end'].includes(x) || trasa['small cave visited twice']) {
                continue;
            }
        }

        najdiCestu(x, cil, cesty, { ...trasa });
    }

    return cesty;
}

const cesty = najdiCestu("start", "end");
console.log(cesty!.length);