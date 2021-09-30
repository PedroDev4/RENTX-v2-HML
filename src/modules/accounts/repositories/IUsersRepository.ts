import { ICreateUserDTO } from "../DTOs/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/model/User";
import { IUpdateUserDTO } from "../DTOs/IUpdateUserDTO";

interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmailDriverLicense(
        email: string,
        driver_license: string
    ): Promise<User>;
    findById(id: string): Promise<User>;
    update(user: IUpdateUserDTO): Promise<void>
    updateIsVerified(id: string, isVerified: boolean): Promise<void>
}

export { IUsersRepository };
