import { ICreateUserTokenDTO } from "@modules/accounts/DTOs/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/model/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";


class UsersTokensRepositoryInMemory implements IUsersTokensRepository {

    private usersTokens: UserTokens[] = [];


    async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {

        const userToken = new UserTokens();

        Object.assign(userToken, {
            user_id,
            expires_date,
            refresh_token
        });

        this.usersTokens.push(userToken);

        return userToken;

    }

    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find((token) => token.user_id === user_id && token.refresh_token === refresh_token);
        return userToken;
    }

    async FindByRefreshToken(resfresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find((token) => token.refresh_token === resfresh_token);
        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const index = this.usersTokens.findIndex((token) => token.id === id);

        this.usersTokens.slice(1, index);
    }

}

export { UsersTokensRepositoryInMemory };