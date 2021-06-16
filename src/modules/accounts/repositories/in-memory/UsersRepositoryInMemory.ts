import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/model/User";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
    private users: User[] = [];

    async create({
        email,
        name,
        driver_license,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, {
            email,
            name,
            driver_license,
            password,
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
}

export { UsersRepositoryInMemory };
