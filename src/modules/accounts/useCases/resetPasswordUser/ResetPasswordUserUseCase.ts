
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import { User } from "@modules/accounts/infra/typeorm/model/User";


interface IRequest {

    token: string,
    new_password: string

}

@injectable()
class ResetPasswordUserUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {

    }

    async execute({ token, new_password }: IRequest): Promise<User> {

        const tokenExists = await this.usersTokensRepository.FindByRefreshToken(token);

        if (!tokenExists) {

            throw new AppError("Invalid token");

        }

        const isBefore: boolean = this.dateProvider.compareIfBefore(tokenExists.expires_date, this.dateProvider.dateNow())

        if (isBefore) {

            throw new AppError("Token is expired!");

        }

        const user = await this.usersRepository.findById(tokenExists.user_id);

        user.password = await hash(new_password, 12);

        const updatedUser = await this.usersRepository.create(user);

        // Após o user efetuar todo o processo de alteração de senha usando o token, iremos remove-lo.
        await this.usersTokensRepository.deleteById(tokenExists.id);

        return updatedUser

    }


}

export { ResetPasswordUserUseCase };