import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayLoad {
    sub: string;
    email: string;
}

interface ITokenResponse {
    refresh_token: string;
    newToken: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(refresh_token: string): Promise<ITokenResponse> {

        const { sub: user_id, email } = verify(refresh_token, auth.secret_refresh_token) as IPayLoad

        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, refresh_token);

        if (!userToken) {
            throw new AppError("Refresh token does not exists.");
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token_expires_date = String(this.dateProvider.addDays(auth.expires_refresh_token_days));

        const new_refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token
        });

        await this.usersTokensRepository.create({
            user_id,
            refresh_token: new_refresh_token,
            expires_date: refresh_token_expires_date
        })

        const newToken = sign({}, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token,
        });

        return {
            refresh_token,
            newToken
        }
    }

}

export { RefreshTokenUseCase };