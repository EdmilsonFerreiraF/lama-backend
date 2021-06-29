export interface Music {
    id: string,
    title: string,
    author: string,
    date: Date,
    file: File | undefined,
    genre: string[],
    album: string
};

export interface CreateMusicInputDTO {
    title: string,
    author: string,
    date: Date,
    file: File | undefined,
    genre: string[],
    album: string
}