import { SignupInputDTO } from "../src/business/entities/user"
import { UserBusiness } from "../src/business/UserBusiness"
import { UserDatabase } from "../src/data/UserDatabase"
import idGenerator, { IdGenerator } from "../src/business/services/idGenerator";
import tokenGenerator, { TokenGenerator } from "../src/business/services/tokenGenerator";
import { HashGenerator } from "../src/business/services/hashGenerator";



describe("Signup testing", () => {
    test("Should return missing input when input data is missing", async() => {
        expect.assertions(1);
        
        const userBusiness: any = new UserBusiness(
            IdGenerator as any,
            HashGenerator as any,
            UserDatabase as any,
            TokenGenerator as any,
        )

        const input: any = {
            name: "dsadasd",
            nickname: "dkasd",
            email: "kdadsadsda",
        }

        const id = idGenerator.generate()

        const token = tokenGenerator.generate({id, nickname: input.nickname})

            try {
                await userBusiness.signup({input, token})
            } catch (error) {
                expect(error.message.toBe("Missing input"))
            }
        }
    )

    test("Should return missing token when token is missing", async() => {
        expect.assertions(1);
        
        const userBusiness: any = new UserBusiness(
            IdGenerator as any,
            HashGenerator as any,
            UserDatabase as any,
            TokenGenerator as any,
        )

        const id = idGenerator.generate()

        const input: any = {
            id,
            name: "dsadasd",
            nickname: "dkasd",
            email: "kdasda@asd.com",
            password: "kdaskdadsadsdada",
        }

            try {
                await userBusiness.signup({input})
            } catch (error) {
                expect(error.message.toBe("Missing token"))
            }
        }
    )

    test("Should return invalid email address when email doesn't have '@'", async() => {
        expect.assertions(1);
        
        const userBusiness: any = new UserBusiness(
            IdGenerator as any,
            HashGenerator as any,
            UserDatabase as any,
            TokenGenerator as any,
        )

        const id = idGenerator.generate()

        const input: any = {
            id,
            name: "dsadasd",
            nickname: "dkasd",
            email: "kdasda",
            password: "kdadsadsda",
        }

        const token = tokenGenerator.generate({id, nickname: input.nickname})

            try {
                await userBusiness.signup({input, token})
            } catch (error) {
                expect(error.message.toBe("Invalid email address"))
            }
        }
    )

    test("Should return password must be more or equal than 6 characters length when it receives short password", async() => {
        expect.assertions(1);
        
        const userBusiness: any = new UserBusiness(
            IdGenerator as any,
            HashGenerator as any,
            UserDatabase as any,
            TokenGenerator as any,
        )

        const id = idGenerator.generate()

        const input: any = {
            id,
            name: "dsadasd",
            nickname: "dkasd",
            email: "kdasda",
            password: "kdasa",
        }

        const token = tokenGenerator.generate({id, nickname: input.nickname})

            try {
                await userBusiness.signup({input, token})
            } catch (error) {
                expect(error.message.toBe("Password must be more or equal than 6 characters length"))
            }
        }
    )
})