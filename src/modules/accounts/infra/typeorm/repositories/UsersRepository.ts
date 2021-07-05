import { ICreateUserDTO } from "@modules/accounts/DTOs/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { getRepository, Repository } from "typeorm";
import { User } from "../model/User";



class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async create({
        name,
        password,
        email,
        driver_license,
        avatar,
        id,
    }: ICreateUserDTO): Promise<User> {
        const user = this.repository.create({
            name,
            password,
            email,
            driver_license,
            avatar,
            id,
        });

        await this.repository.save(user);

        return user;
    }

    async findByEmailDriverLicense(
        email: string,
        driver_license: string
    ): Promise<User> {
        const user = await this.repository.findOne({
            where: { email, driver_license },
        });
        console.log(user);

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne({ id });
        return user;
    }
}

export { UsersRepository };
