import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { User } from "@modules/accounts/infra/typeorm/model/User";


@injectable()
class FindUserByEmailAndDriverLicenceUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute(email: string, driver_license: string): Promise<User> {

        const user = await this.usersRepository.findByEmailDriverLicense(email, driver_license);

        if (!user) {
            throw new AppError('User does not exists');
        }

        return user;
    }

}

export { FindUserByEmailAndDriverLicenceUseCase };