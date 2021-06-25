export interface Music {
    id: string,
    title: string,
    author: string,
    date: Date,
    file: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        buffer: Buffer,
        size: number,
    },
    genre: string[],
    album: string
};

export interface CreateMusicInputDTO {
    title: string,
    author: string,
    date: Date,
    file: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        buffer: Buffer,
        size: number,
    },
    genre: string[],
    album: string
}