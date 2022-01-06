const input = await Deno.readTextFile("./input.txt");

let template: string = " ";
let reactions: { [key: string]: string } = {};

input.split("\n").forEach((element: string, index: number) => {
    if (!element.trim()) return;

    if (index == 0) {
        template = element.trim();
        return;
    }

    const [pair, result] = element.split("->");
    reactions[pair.trim()] = result.trim();
});

/*
    Part 1 implementace: 
    for (let step = 0; step < 10; step++) {

        const characters = template!.split("");
        const charactersLength = characters.length;
        let newTemplate = "";

        for (let index = 1; index < charactersLength; index++) {
            let key = `${characters[index - 1]}${characters[index]}`;

            if (key in reactions) {
                newTemplate = newTemplate.slice(0, newTemplate.length - 1) + `${characters[index - 1]}${reactions[key]}${characters[index]}`;
            }
        }

        template = newTemplate;
    }

    const vyskyty: { [key: string]: number } = {}
    template.split("").map((v: string) => vyskyty[v] = vyskyty[v] + 1 || 1);
*/

let pairs: { [key: string]: number } = {};  //Slovník pro uchování jednotlivých párů písmen
let characters = template.split("");    //Znaky počátečního templatu

//Naplnění slovníku počátečními páry písmen
for (let index = 1; index < template.length; index++) {
    let key = `${characters[index - 1]}${characters[index]}`;
    pairs[key] = pairs[key] + 1 || 1;
}

//Simulace jednotlivých reakcí
for (let step = 0; step < 40; step++) {
    let newPairs: { [key: string]: number } = {};

    //Pro každý pár, pokud existuje reakce
    //Vytvoří se dva nové páry a přidají se do slovníku
    for (const pair of Object.keys(pairs)) {

        if (reactions[pair]) {
            let firstPair = pair[0] + reactions[pair];
            let secondPair = reactions[pair] + pair[1];

            newPairs[firstPair] = pairs[pair] + ( newPairs[firstPair] || 0 );
            newPairs[secondPair] = pairs[pair] + ( newPairs[secondPair] || 0);
        }
    }

    //Nová kopie párů se propíše do staré
    //Tím zajistíme, že se reakce provedou naráz
    pairs = newPairs;
}

//Slovník pro výskyt jednotlivých písmen
const vyskyty: { [key: string]: number } = {};
//Pole jednotlivých párů písmen
let keys = Object.keys(pairs);

for (let index = 0; index < keys.length; index++) {
    //Nalezení prvního písmena a přičtení k výskytu
    const letter = keys[index][0];
    const count = pairs[keys[index]];

    vyskyty[letter] ??= 0;
    vyskyty[letter] += count;

    //Započítání posledního písmena na konci templatu, protože počítáme jenom první z páru.
    //Mohlo by to být i mimo smyčku, ale chtěl jsem si to nechat pohromadě.
    if (index == keys.length - 1) {
        const lastLetter = template?.split("")?.pop() ?? "";
        vyskyty[lastLetter] ??= 0;
        vyskyty[lastLetter] += 1;

        console.log("Last letter: ", lastLetter);
    }
}

//Výstup pro odpovědi
console.log(Math.max(...Object.values(vyskyty)) - Math.min(...Object.values(vyskyty)));