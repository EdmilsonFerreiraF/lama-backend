import { UserBusiness } from "../src/business/UserBusiness"
import { User } from "../src/data/model/User";
import { LoginInputDTO, SignupInputDTO } from "../src/business/entities/user";
import { CustomError } from "../src/errors/CustomError";

const toModel = (dbModel?: any): User => {
    return (
       dbModel &&
       new User(
          dbModel.id,
          dbModel.name,
          dbModel.email,
          dbModel.nickname,
          dbModel.password
       )
    );
 };

const userDatabase = {
    createUser: jest.fn(async (user: SignupInputDTO) => { }),
    getUserByEmail: jest.fn((user: LoginInputDTO) => {
        if (user.email === "user_email@email.com") {
            return toModel({
                id: "user_id",
                nome: "user_name",
                email: user.email,
                password: "user_password"
            })
        } else {
            throw new CustomError(440, `Unable to find user with email: ${user.email}`);
        }
    })
}

const tokenGenerator = {
    generate: jest.fn((payload: {id: string, nickname: string}) => "token"),
    verify: jest.fn((token: string) => {
        return { id: "token id", nickname: "nickname string" }
    })
}

const idGenerator = {
    generate: jest.fn(() => "user id")
}

const hashGenerator = {
    hash: jest.fn((password: string) => "PASS"),
    compareHash: jest.fn((text: string, hash: string) => text === "user_password" ? true : false)
}

const userBusiness: any = new UserBusiness(
    idGenerator as any,
    hashGenerator as any,
    userDatabase as any,
    tokenGenerator as any,
)

describe("Creating documents in MongoDB", () => {
    test("Should return missing input when input data is missing", async() => {
        expect.assertions(2);

        const user = {
            nickname: "user_nickname",
            email: "user_email@email.com",
            password: "user_password"
        } 

        try {
            return await userBusiness.createUser(user)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    });

    
    test("Should return missing input when input data is missing", async() => {
        expect.assertions(2);

        const user = {
            name: "user_name",
            email: "user_email@email.com",
            password: "user_password"
        } 

        try {
            return await userBusiness.createUser(user)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    });
    
   
    test("Should return missing input when input data is missing", async() => {
        expect.assertions(2);

        const user = {
            name: "user_name",
            email: "user_email@email.com",
            nickname: "user_nickname",
        } 

        try {
            return await userBusiness.createUser(user)
        } catch(error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    });

    test("Should return invalid email address when email doesn't have '@'", async() => {
        expect.assertions(1);
        
        const input = {
            name: "user_name",
            email: "user_email",
            nickname: "user_nickname",
            password: "user_password"
        } 
        
        try {
            return await userBusiness.createUser(input)
        } catch (error) {
            expect(error.message).toBe("Invalid email address")
        }
    })

    test("Should return password must be more or equal than 6 characters length when it receives short password", async() => {
        expect.assertions(1);
        
        const user = toModel({
            id: "user_id",
            name: "user_name",
            nickname: "user_nickname",
            email: "user_email@email.com",
            password: "123"
        })

        try {
            return await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Password must be more or equal than 6 characters length")
        }
    })

    test("Should return token", async() => {
        expect.assertions(1)
        
        const user = toModel({
            name: "user_name",
            email: "user_email@email.com",
            nickname: "user_nickname",
            password: "user_password"
        }) as any

        const res = await userBusiness.createUser(user)
        expect(res).toEqual({token: "token"});
    })
})

describe("Sign in testing", () => {
    test("Should return missing input when some input data is missing", async() => {
        expect.assertions(2)
        
        const user = {
            email: "user_email@email.com"
        } as LoginInputDTO

        try {
            return await userBusiness.getUserByEmail(user)
        } catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return missing input when some input data is missing", async() => {
        expect.assertions(2)
        
        const user = {
            password: "user_password"
        } as LoginInputDTO

        try {
            return await userBusiness.getUserByEmail(user)
        } catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(422);
        }
    })

    test("Should return error when there's no user linked to the email", async() => {
        expect.assertions(2)
        
        const user = {
            email: "user_other_email@email.com",
            password: "user_password"
        } as LoginInputDTO

        try {
            return await userBusiness.getUserByEmail(user)
        } catch (error) {
            expect(error.message).toBe(`Unable to find user with email: ${user.email}`);
            expect(error.statusCode).toBe(440);
        }
    })

    test("Should return error when user login is incorrect", async() => {
        expect.assertions(2)
        
        const user = {
            email: "user_email@email.com",
            password: "user_wrong_password"
        } as LoginInputDTO

        try {
            return await userBusiness.getUserByEmail(user)
        } catch (error) {
            expect(error.message).toBe(`Invalid credentials`);
            expect(error.statusCode).toBe(401);
        }
    })

    test("Should return token", async() => {
        expect.assertions(1)

        const user = {
            email: "user_email@email.com",
            password: "user_password"
        } as LoginInputDTO

        const res = await userBusiness.getUserByEmail(user)
        expect(res).toEqual({token: "token"});
    })
})