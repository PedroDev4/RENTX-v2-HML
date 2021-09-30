import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/model/User";
import { IUsersRepository } from "../IUsersRepository";
import { IUpdateUserDTO } from "@modules/accounts/DTOs/IUpdateUserDTO";

class UsersRepositoryInMemory implements IUsersRepository {
    private users: User[] = [];

    async create({
        email,
        name,
        driver_license,
        password,
        isVerified,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, {
            email,
            name,
            driver_license,
            password,
            isVerified
        });

        this.users.push(user);

        return user;
    }
    async findByEmailDriverLicense(
        email: string,
        driver_license: string
    ): Promise<User> {
        const user = this.users.find(
            (user) =>
                user.email === email && user.driver_license === driver_license
        );
        return user;
    }
    async findById(id: string): Promise<User> {
        return this.users.find((user) => user.id === id);
    }

    async update(userUpdate: IUpdateUserDTO): Promise<void> {
        const userIndex = this.users.findIndex((user) => user.id === userUpdate.id);
        this.users.splice(userIndex, 1);

        const user = new User();

        Object.assign(user, userUpdate);

        this.users.push(user);
    }

    updateIsVerified(id: string, isVerified: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export { UsersRepositoryInMemory };
