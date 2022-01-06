interface IPacket {
    version: number;
    typeID: number;
    id: number;
    parent: number | null;
    data: string[];
    next?: string;
    lengthTypeID?: number;
    length: number;
    nextPacketsLength?: number;
    raw: string;
    body?: number;
}

export default IPacket;