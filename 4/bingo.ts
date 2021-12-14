class Bingo {
    public rozmer: number;
    public tabulka: number[][];
    public znacky: boolean[][];

    public skore: number;
    public vyhrana: boolean;
    private posledniCislo: number;

    constructor(rozmer: number, ...radky: number[][]) {
        this.rozmer = rozmer;
        this.skore = 0;
        this.posledniCislo = 0;
        this.vyhrana = false;

        //Vytvoří tabulku pro čísla
        this.tabulka = new Array(rozmer);

        //Vytvoří tabulku pro značky
        this.znacky = new Array(rozmer);

        radky.forEach((radek, index) => {
            if (index < rozmer) {
                this.tabulka[index] = radek;
                this.znacky[index] = new Array(rozmer).fill(false);
            }
        });
    }

    public oznacCislo(cislo: number) {
        this.posledniCislo = cislo;

        //Projede celou tabulku a označí číslo v matici značek
        for (let x = 0; x < this.rozmer; x++) {
            let index = this.tabulka[x].indexOf(cislo);
            
            if (index > -1) {
                this.znacky[x][index] = true;

                this.zkontroluj();
                break;
            }
        }        
    }

    //Zkontroluje, jestli neexistuje řádek či sloupec označených čísel
    //Zkontroluje se řádek a sloupec značek, jestli všude není true
    public zkontroluj() {
        for (const radek of [...this.znacky, ...this.transpozice(this.znacky)]) {
            if (radek.every((znacka) => znacka)) {
                this.vyhrana = true;
                this.vypocitejSkore();
            }
        }
    }

    //Utilita ukradnutá z třetího dne
    private transpozice<T>(matice:T[][]) {
        return matice[0].map((_, indexSloupce: number) => matice.map((radek:T[], indexRadku: number) => radek[indexSloupce]));
    }

    //Vypočítá skóre
    //Přičítá čísla, která jsou vymaskována maticí značek
    private vypocitejSkore() {
        let soucet = 0;
        for (let radek = 0; radek < this.tabulka.length; radek++) {
            soucet += this.tabulka[radek].reduce((akumulator, hodnota, index) => {
                if (!this.znacky[radek][index]) {
                    return akumulator + hodnota
                }
                return akumulator;
            }, 0);
        }

        this.skore = soucet * this.posledniCislo;
    }
}

export default Bingo;