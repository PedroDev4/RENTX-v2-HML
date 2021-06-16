import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/DTOs/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/model/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {
        //
    }

    async execute({
        name,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<User> {
        // Verificando existencia do usuário na base de dados

        const userExists = await this.usersRepository.findByEmailDriverLicense(
            email,
            driver_license
        );

        if (userExists) {
            throw new AppError("User Already exists");
        }

        const cryptedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            password: cryptedPassword,
            email,
            driver_license,
        });

        return user;
    }
}

export { CreateUserUseCase };
