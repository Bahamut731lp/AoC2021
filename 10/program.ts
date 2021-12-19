//Načtení dat ze souboru
const input = await Deno.readTextFile("./input.txt");
const data = input.trim().split("\n").map(v => v.trim())

//Slovník otevíracích a uzavíracích znaků
const gramatika: { [key: string]: string } = {
    "{": "}",
    "(": ")",
    "<": ">",
    "[": "]"
}

//Slovník s ohodnocením uzavíracích znaků pro tokenizer
const syntaxHodnoceni: { [key: string]: number } = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137 
}

//Slovník s ohodnocením uzavíracíh znaků pro autocomplete
const autocompleteHodnoceni: { [key: string]: number } = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4 
}

let skoreSyntax = 0;
let autocomplete: number[] = [];

for (const radek of data) {
    //Zásobník pro uzavírací znaky
    const symbolStack = []; 
    let syntaxError = false;

    //Symbol po symbolu se projede řádek
    for (const symbol of radek) {
        //Pokud se najde otevírací znak, přidá se jeho uzavírací znak do zásobníku
        if (gramatika[symbol]) {
            symbolStack.push(gramatika[symbol]);
        }
        //Pokud to není otevírací znak, musí být uzavírací
        else {
            //Jestli je ten správný zjistíme tak, že vytáhneme poslední prvek ze zásobníku
            const uzaviraciSymbol = symbolStack.pop();
            //Pokud se neshodují, máme syntax error
            if (symbol !== uzaviraciSymbol) {
                skoreSyntax += syntaxHodnoceni[symbol];
                syntaxError = true;

                break;
            }
        }
    }

    if (!syntaxError && symbolStack.length > 0) {
        let skore = symbolStack.reduceRight((acc, v) => acc * 5 + autocompleteHodnoceni[v], 0);
        autocomplete.push(skore);
    }
}

console.log(skoreSyntax);

let prostredniSkore = autocomplete
.sort((a, b) => a - b) //Seřadí pole vzestupně
.splice(((autocomplete.length / 2) + (autocomplete.length % 2)) - 1, 1) //Vrátí pole s prostředním prvkem
.pop(); //Vyhodí prostřední prvek z pole do proměnné

console.log(prostredniSkore);