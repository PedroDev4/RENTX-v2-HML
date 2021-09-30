import { User } from "@modules/accounts/infra/typeorm/model/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";


@injectable()
class ConfirmUserValidationUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute(token: string): Promise<User> {

        const userToken = await this.usersTokensRepository.FindByRefreshToken(token);

        if (!userToken) {
            throw new AppError('UserToken does not exists')
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        await this.usersRepository.updateIsVerified(user.id, true);

        return user;
    }

}

export { ConfirmUserValidationUseCase };