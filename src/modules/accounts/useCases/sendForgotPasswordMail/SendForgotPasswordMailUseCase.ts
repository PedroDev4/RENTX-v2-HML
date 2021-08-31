import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import { v4 as uuidv4 } from "uuid";
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/Providers/MailProvider/IMailProvider";
import { resolve } from "path";

@injectable()
class SendForgotPasswordMailUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider
    ) { }

    async execute(to_email: string, driver_license: string) {
        const expires_in_mail = 3;


        const template_path = resolve(__dirname, "../", "../", "views", "emails", "forgotPassword.hbs");

        const user = await this.usersRepository.findByEmailDriverLicense(to_email, driver_license);

        if (!user) {
            throw new AppError("User does not exists");
        }

        const token = uuidv4();

        const expires_date = String(this.dateProvider.addDays(expires_in_mail));

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date: expires_date
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.mailProvider.sendMail(to_email, "Recuperação de Senha", variables, template_path);
    }

}

export { SendForgotPasswordMailUseCase };