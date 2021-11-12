import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { resolve } from 'path';
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/Providers/MailProvider/IMailProvider";
import { v1 as uuid } from "uuid";

@injectable()
class ConfirmUserVerifyEmailUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UsersTokensRepository')
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider
    ) { }

    async execute(id: string, email: string): Promise<void> {
        const expires_date_mail = 2;

        const newUser = await this.usersRepository.findById(id);

        if (newUser.isVerified || !newUser) {
            console.log(`entrou aq`);
            throw new AppError("User already verified or does't xists");
        }

        if (newUser.email != email) {
            throw new AppError('Provided email does not match');
        }

        const template_path = resolve(__dirname, '../', "../", 'views', 'emails', 'confirmuser.hbs');

        const token = uuid();

        const expires_date = String(this.dateProvider.addHours(expires_date_mail));

        await this.usersTokensRepository.create({
            expires_date,
            refresh_token: token,
            user_id: newUser.id
        });

        const variables = {
            name: newUser.name,
            link: `${process.env.CONFIRM_USER_URL}${token}`
        }

        await this.mailProvider.sendMail(email, 'Confirmação de novo usuário', variables, template_path);
    }

}

export { ConfirmUserVerifyEmailUseCase };