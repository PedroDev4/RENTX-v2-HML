import { User } from '@modules/accounts/infra/typeorm/model/User';
import { IUserResponseDTO } from '../DTOs/IUserResponseDTO';

class UserMapper {

    static toDTO({ email, name, id, avatar, driver_license }: User, avatarUrl: string): IUserResponseDTO {
        return {
            id,
            email,
            avatar,
            driver_license,
            name,
            avatarUrl
        }
    }

}

export { UserMapper };