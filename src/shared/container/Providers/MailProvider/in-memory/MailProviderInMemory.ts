import { IMailProvider } from "../IMailProvider";


class MailProviderInMemory implements IMailProvider {

    private message: any[] = [];

    async sendMail(to_user: string, subject: string, variables: any, path: string): Promise<void> {
        this.message.push(to_user, subject, variables, path);
    }

}

export { MailProviderInMemory };