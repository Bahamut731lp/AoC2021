export const sum = (...packets: number[]): number => packets.reduce((acc, v) => acc += v, 0);
export const product = (...packets: number[]): number => packets.reduce((acc, v) => acc *= v, 1);
export const minimum = (...values: number[]): number => Math.min(...values);
export const maximum = (...values: number[]): number => Math.max(...values);
export const greaterThan = (value1: number, value2: number): number => Number(value1 > value2);
export const lesserThan = (value1: number, value2: number): number => Number(value1 < value2);
export const equalTo = (value1: number, value2: number): number => Number(value1 == value2);

export const decode = (id: number) => {
    switch (id) {
        case 0:
            return sum;
        
        case 1:
            return product;
        
        case 2:
            return minimum;
        
        case 3:
            return maximum;

        case 5:
            return greaterThan;

        case 6:
            return lesserThan;

        case 7:
            return equalTo;

        default:
            return undefined;
    }
}