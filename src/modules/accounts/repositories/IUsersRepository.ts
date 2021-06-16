import { ICreateUserDTO } from "../DTOs/ICreateUserDTO";
import { User } from "../model/User";

interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmailDriverLicense(
        email: string,
        driver_license: string
    ): Promise<User>;
    findById(id: string): Promise<User>;
}

export { IUsersRepository };
