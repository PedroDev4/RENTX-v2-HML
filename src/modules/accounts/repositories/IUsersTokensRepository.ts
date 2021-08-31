import { ICreateUserTokenDTO } from "../DTOs/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/model/UserTokens";


interface IUsersTokensRepository {

    create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens>;
    findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens>;
    FindByRefreshToken(token: string): Promise<UserTokens>;
    deleteById(id: string): Promise<void>

}

export { IUsersTokensRepository }