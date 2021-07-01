import { MusicBusiness } from "../src/business/MusicBusiness"
import { CreateMusicInputDTO } from "../src/business/entities/music";
import { Music } from "../src/data/model/Music";
import { CustomError } from "../src/errors/CustomError";

const toModel = (dbModel?: any): Music => {
    return (
       dbModel &&
       new Music(
            dbModel.id,
            dbModel.title,
            dbModel.author,
            dbModel.date,
            dbModel.file,
            dbModel.genre,
            dbModel.album
       )
    );
 };

const musicDatabase = {
    createMusic: jest.fn(async (music: any, token: string) => { 
        return {
            title: "music_title"
        }
    }),
    getAllMusics: jest.fn((token: string) => {
        const music = {
            id: "music_id",
            title: "music_title",
            author: "music_author",
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"],
            album: "music_album"
        }
        
        const allMusics = [music, music, music, music, music]

        return allMusics.map((music: any) => toModel(music));
    }),
    getMusicById: jest.fn((id: string) => {
        return {
            buffer: {
                music_buffer: "music_buffer"
            }
        }
    }),
    getMusicDetailsById: jest.fn((id: string, token: string) => {
        if (id === "music_id") {
            return toModel({
                id: "music_id",
                title: "music_title",
                author: "music_author",
                date: "01/01/2000",
                file: {
                    music_file: "music_file"
                },
                genre: ["music_genre"],
                album: "music_album"
            })
        } else {
            throw new CustomError(440, `Unable to find music with id: ${id}`);
        }
    }),
    getMusicByName: jest.fn((title: string, token: string) => {
        if (title === "music_id") {
            return toModel({
                id: "music_id",
                title: "music_title",
                author: "music_author",
                date: "01/01/2000",
                file: {
                    music_file: "music_file"
                },
                genre: ["music_genre"],
                album: "music_album"
            })
        } else {
            throw new CustomError(440, `Unable to find music with name: ${title}`);
        }
    }),
    deleteMusicById: jest.fn((id: string, token: string) => {
        if (id !== "music_id") {
            throw new CustomError(440, `Unable to find music with name: ${id}`);
        }
    })
}

const tokenGenerator = {
    generate: jest.fn((payload: {id: string, nickname: string}) => "token"),
    verify: jest.fn((token: string) => {
        return { id: "token_id", nickname: "token_nickname" }
    })
}

const idGenerator = {
    generate: jest.fn(() => "music_id")
}

const musicBusiness: any = new MusicBusiness(
    idGenerator as any,
    musicDatabase as any,
    tokenGenerator as any,
)

describe("Creating documents in MongoDB", () => {
    test("Should return missing input when input title is missing", async() => {
        expect.assertions(2);

        const music = {
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"],
            album: "music_album"
        };

        const token = "user_token"

        try {
            return await musicBusiness.createMusic(music, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return missing input when input date is missing", async() => {
        expect.assertions(2);

        const music = {
            title: "music_title",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"],
            album: "music_album"
        };

        const token = "user_token"

        try {
            return await musicBusiness.createMusic(music, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return missing input when input file is missing", async() => {
        expect.assertions(2);

        const music = {
            title: "music_title",
            date: "01/01/2000",
            genre: ["music_genre"],
            album: "music_album"
        };

        const token = "user_token"

        try {
            return await musicBusiness.createMusic(music, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })
    
    test("Should return missing input when input genre is missing", async() => {
        expect.assertions(2);

        const music = { 
            title: "music_title",
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            album: "music_album"
        };

        const token = "user_token"

        try {
            return await musicBusiness.createMusic(music, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })
    
    test("Should return missing input when input album is missing", async() => {
        expect.assertions(2);

        const music = { 
            title: "music_title",
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"]
        };

        const token = "user_token"

        try {
            return await musicBusiness.createMusic(music, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })
    
    test("Should return newly created music", async() => {
        expect.assertions(1);
        
        const music = { 
            title: "music_title",
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"],
            album: "music_album"
        };

        const createMusic = jest.spyOn(musicBusiness, 'createMusic')
        const token = "user_token"

        await musicBusiness.createMusic(music, token)
        expect(createMusic).toHaveBeenCalledWith(music, token)
    })
})

describe("Testing getAllMusics", () => {  
    test("Should return missing input when id is missing", async() => {
        expect.assertions(2);

        const token = ""

        try {
            return await musicBusiness.getAllMusics(token)
        } catch(error) {
            expect(error.message).toBe("Missing token");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return all musics when token is provided", async() => {
        expect.assertions(1);

        const music = {
            id: "music_id",
            title: "music_title",
            author: "music_author",
            date: "01/01/2000",
            file: {
                music_file: "music_file"
            },
            genre: ["music_genre"],
            album: "music_album"
        }

        const allMusics = [music, music, music, music, music]

        const token = "user_token"

        const res = await musicBusiness.getAllMusics(token)
        expect(res).toStrictEqual(allMusics.map((music: any) => toModel(music)));
    })
})

describe("Testing getMusicById", () => {  
    test("Should return missing input when input is missing", async() => {
        expect.assertions(2);

        const id = ""

        try {
            return await musicBusiness.getMusicById(id)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return music buffer when token is provided", async() => {
        expect.assertions(1);

        const id = "music_id"

        const res = await musicBusiness.getMusicById(id)
        expect(res.buffer).toStrictEqual(
            {
                music_buffer: "music_buffer"
            }
        );
    })
})

describe("Testing getMusicDetailsById", () => {  
    test("Should return missing input when id is missing", async() => {
        expect.assertions(2);

        const token = "user_token"

        const id = undefined;

        try {
            return await musicBusiness.getMusicDetailsById(id, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })
    
    test("Should return missing token when token is missing", async() => {
        expect.assertions(2);

        const id = "music_id"

        const token = undefined;

        try {
            return await musicBusiness.getMusicDetailsById(id, token)
        } catch(error) {
            expect(error.message).toBe("Missing token");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return error when the music doesn't exist", async() => {
        expect.assertions(2);

        const id = "music_wrong_id"

        const token = "user_token"

        try {
            return await musicBusiness.getMusicDetailsById(id, token)
        } catch(error) {
            expect(error.message).toBe(`Unable to find music with id: ${id}`);
            expect(error.statusCode).toBe(440);
        }
    })
    
    test("Should return music when id is present", async() => {
        expect.assertions(6);

        const id = "music_id"

        const token = "user_token"

        const res = await musicBusiness.getMusicDetailsById(id, token)
        expect(res.getId()).toBe("music_id");
        expect(res.getTitle()).toBe("music_title");
        expect(res.getDate()).toBe("01/01/2000");
        expect(res.getFile()).toStrictEqual({"music_file": "music_file"});
        expect(res.getGenre()).toStrictEqual(["music_genre"]);
        expect(res.getAlbum()).toBe("music_album");
    })
})

describe("Testing deleteMusicById", () => {  
    test("Should return missing input when id is missing", async() => {
        expect.assertions(2);

        const token = "user_token"

        const id = undefined;

        try {
            return await musicBusiness.deleteMusicById(id, token)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })
    
    test("Should return missing token when token is missing", async() => {
        expect.assertions(2);

        const id = "music_id"

        const token = undefined;

        try {
            return await musicBusiness.deleteMusicById(id, token)
        } catch(error) {
            expect(error.message).toBe("Missing token");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return error when the music doesn't exist", async() => {
        expect.assertions(2);

        const id = "music_wrong_id"

        const token = "user_token"

        try {
            return await musicBusiness.deleteMusicById(id, token)
        } catch(error) {
            expect(error.message).toBe(`Unable to find music with name: ${id}`);
            expect(error.statusCode).toBe(440);
        }
    })
    
    test("Should return id and token when id and token are present", async() => {
        expect.assertions(1);

        const id = "music_id"

        const token = "user_token"

        const deleteMusicById = jest.spyOn(musicBusiness, 'deleteMusicById')
        await musicBusiness.deleteMusicById(id, token)
        expect(deleteMusicById).toHaveBeenCalledWith(id, token)
    })
})