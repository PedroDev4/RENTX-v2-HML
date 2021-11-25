import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponseData {
    id: string;
    name: string;
    email: string;
}

@injectable()
class ConfirmUserValidationUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute(token: string): Promise<IResponseData> {

        const userToken = await this.usersTokensRepository.FindByRefreshToken(token);

        if (!userToken) {
            throw new AppError('UserToken does not exists')
        }

        console.log(token);
        const user = await this.usersRepository.findById(userToken.user_id);

        await this.usersRepository.updateIsVerified(user.id, true);

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }

}

export { ConfirmUserValidationUseCase };