import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { UserMapper } from '@modules/accounts/Mapper/UserMapper';
import { IUserResponseDTO } from "@modules/accounts/DTOs/IUserResponseDTO";


@injectable()
class FindUserByEmailAndDriverLicenceUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute(email: string, driver_license: string): Promise<IUserResponseDTO> {
        const user = await this.usersRepository.findByEmailDriverLicense(email, driver_license);

        if (!user) {
            throw new AppError('User does not exists');
        }

        return UserMapper.toDTO(user, this.getUserAvatarUrl(user.avatar));
    }

    private getUserAvatarUrl(avatar: string): string {
        avatar = avatar.substring(avatar.indexOf("-") + 1);
        console.log(avatar);

        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/avatar/${avatar}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/avatar/${avatar}`;
            default:
                return null;
        }
    }

}

export { FindUserByEmailAndDriverLicenceUseCase };