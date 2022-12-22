export interface BufferNewQPush {
    size: number,
    pushes: number,
    index: number,
    vals: Array<number>,
}

export interface BufferNewPush {
    size: number,
    pushes: number,
    index: number,
    sum: number,
    vals: Array<number>,
}