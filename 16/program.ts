import IPacket from "./IPacket.ts";
import * as Operations from "./operations.ts";

/*
    Program funguje na všech testovacích případech. až, samozřejmě, na finální input -_- (pro part 2)
*/

const input = await Deno.readTextFile("./sample.txt");
const HexToBin = (char: string) => parseInt(char, 16).toString(2).padStart(4, "0");
const BinToDec = (binary: string) => Number(parseInt(binary, 2).toString(10));

const decodePacket = (string: string, id: number, parent: number | null): IPacket => {
    let version = BinToDec(string.slice(0, 3));
    let typeID = BinToDec(string.slice(3, 6));
    let data = (string.slice(6).match(/.{5}/gi) || []) as string[];
    let next = data.join("");

    let remainder = string.slice(6).length % 5;
    if (Number(remainder) != 0)  data.push(string.slice(-1 * remainder).padEnd(5, "0"));
    
    let raw = string.slice(0,6);
    let length = raw.length;

    return { version, typeID, data, next, length, raw, id, parent };
}

const decodeLiteralValue = (packet: IPacket) => {
    let cachedLength = packet.data.length;
    let mutableData = packet.data;
    let bytes: string[] = [];
    let raw = packet.raw;

    for (let index = 0; index < cachedLength; index++) {
        const element = mutableData.shift() as string;

        bytes.push(element.slice(1));
        raw += element;
        //Pokud nibble začíná nulou, je poslední v packetu a ukončí se smyčka
        if (element[0] == "0") break;
    }

    let body = BinToDec(bytes.join(""));

    return { ...packet, data: mutableData, raw, length: raw.length, body, next: mutableData.join("") };
};

const decodeOperator = (packet: IPacket) => {
    let mutableData = packet.data.join("").split("");

    /*
        lengthTypeID == 1 - 11 bitů reprezentující počet subpacketů v tomto packetu
        lengthTypeID == 0 - 15 bitů reprezentující počet bitů subpacketů v tomto packetu
    */
    let lengthTypeID = Number(mutableData.shift());
    let nextPacketInfo = mutableData.splice(0, Boolean(lengthTypeID) ? 11 : 15).join("");
    let nextPacketsLength = BinToDec(nextPacketInfo);
    let joinedData = mutableData.join("");

    let raw = packet.raw + String(lengthTypeID) + nextPacketInfo;

    return { ...packet, lengthTypeID, nextPacketsLength, raw, length: raw.length, next: joinedData }
};

//Mapování typů packetů a dekoderů jejich dat.
const DecoderMap = {
    "4": decodeLiteralValue
}


const Handler = {
    get: (target: any, prop: string) => {
        return !(prop in target) ? decodeOperator : target[prop];
    }
}

const Decoders = new Proxy(DecoderMap, Handler);

//Převedení hexadecimálního vstupu do binární soustavy
let packet = input.trim().split("").map((v: string) => HexToBin(v)).join("");
let versionSum = 0;

interface IInheritance {
    type: number;
    parent: number;
    remaining: number;
}

let stack: IInheritance[] = [];
let packets: { [key: string]: any } = {};

//Parsování packetu
const parse = (data: string, id: number = 0, parent: number | null = null) => {
    const decoded = decodePacket(data, id, parent);
    const dataDecoder = Decoders[decoded.typeID];
    const result = dataDecoder(decoded);

    versionSum += result.version;

    if (stack.length > 0) {
        parent = stack[0].parent;

        if (stack[0].type == 0) {
            stack.map(v => {
                if (v.type == 0) v.remaining -= result.length;
            })
        }
        else {
            stack[0].remaining -= 1;
        }

        while (stack.length > 0 && stack[0].remaining <= 0) {
            stack.shift();
        }
    }

    //Přidání informace o subpacketech do zásobníku
    if (result?.nextPacketsLength) {

        //Pro ID 5, 6, 7 víme, že tam jsou !vždycky! dva subpackety (jsou to relační operace)
        if (result.typeID > 4 ) {
            result.lengthTypeID = 1;
            result.nextPacketsLength = 2;
        }


        stack.unshift({ parent: id, type: result?.lengthTypeID, remaining: result?.nextPacketsLength });
    }

    packets[id] = result;
    
    if (parent != null) {
        packets[id].parent = parent;
    }

    if (result.next && parseInt(result.next) != 0) {
        parse(result.next, id += 1, parent)
    }
}

parse(packet);

interface Operations {
    id: number;
    operation: any;
    operands?: number[];
    children?: number[];
}

let operations: { [key: string]: Operations} = {};

//Procházení packetů a vytváření hiearchie operací
for (const id in packets) {
    const packet = packets[id];

    operations[packet.id] ??= {
        id: -1,
        operation: "",
        operands: [],
        children: []
    };

    if (packet?.parent != null) operations![packet.parent]!.children!.push(packet.id);
    if (packet?.body != null) operations?.[packet.id]?.operands?.push(packet.body as number);
    
    operations![packet.id]!.operation = Operations.decode(packet.typeID);
    operations![packet.id]!.id = packet.id;
}

//Vyhodnocení výrazů včetně zanořených
const evaluate = (instruction: Operations) => {
    let { operation, operands, children, id } = instruction;

    if (typeof operation == "undefined") return operands![0];

    if (children!.length > 0) {
        children!.forEach(v => {
            operands!.push(evaluate(operations![v]))
        })
    }

    let result = operation(...operands as number[]);
    return result;
}

console.log("Part 1: ", versionSum);
console.log("Part 2: ", evaluate(operations[0]));