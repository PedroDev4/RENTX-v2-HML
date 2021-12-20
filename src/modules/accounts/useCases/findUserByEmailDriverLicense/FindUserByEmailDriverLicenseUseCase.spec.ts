import { ICreateUserDTO } from "@modules/accounts/DTOs/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { FindUserByEmailAndDriverLicenceUseCase } from "./FindUserByEmailAndDriverLicenseUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let findUserByEmailAndDriverLicenseUsecase: FindUserByEmailAndDriverLicenceUseCase
describe("Find User By Email and Driver License", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        findUserByEmailAndDriverLicenseUsecase = new FindUserByEmailAndDriverLicenceUseCase(usersRepositoryInMemory);
    });

    it('Should be able to find an existing user by email and driver_license', async () => {
        const userDTO: ICreateUserDTO = {
            driver_license: "XiXi",
            email: "user@tester.com",
            password: "1212",
            name: "User tester",
            avatar: "15248-JeffFranklin"
        };

        const userCreated = await usersRepositoryInMemory.create(userDTO);

        const userFinded = await findUserByEmailAndDriverLicenseUsecase.execute(userDTO.email, userDTO.driver_license);

        expect(userFinded).not.toBe(null);
        expect(userFinded.id).toStrictEqual(userCreated.id);
    });

});