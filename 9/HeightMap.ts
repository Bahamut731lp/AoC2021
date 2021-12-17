class HeightMap {
    private matice: number[][];
    private tMatice: number[][];

    constructor(...radky: number[][]) {
        this.matice = [];
        radky.forEach((radek, index) => {
            this.matice.push(radek);
        });

        this.tMatice = this.transpozice(this.matice);
    }

    //Utilita ukradnutá z třetího dne
    private transpozice<T>(matice:T[][]) {
        return matice[0].map((_, indexSloupce: number) => matice.map((radek:T[], indexRadku: number) => radek[indexSloupce]));
    }

    public okoliBodu(x: number, y: number) {
        const indexyRadku = [y - 1 < 0 ? 0 : y - 1, y + 2 > this.matice[x].length ? y + 1 : y + 2];
        const indexySloupce = [x - 1 < 0 ? 0 : x - 1, x + 2 > this.matice[x].length ? x + 1 : x + 2];

        return [...this.matice[x].slice(...indexyRadku), ...this.tMatice[y].slice(...indexySloupce)];
    }

    public bod(x: number, y: number) {
        if (x < 0 || y < 0) {
            return Infinity;
        }
        
        if ((x > this.matice.length -1) || (y > this.matice[x].length -1)) {
            return Infinity;
        }

        return this.matice[x][y];
    }
}

export default HeightMap;