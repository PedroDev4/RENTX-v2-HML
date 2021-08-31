import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

@injectable()
class EtherealMailProvider implements IMailProvider {

    private client: Transporter;

    constructor() { // Initialializing TRANSPORTER
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        }).catch((err) => console.error(err));
    }

    async sendMail(to_user: string, subject: string, variables: any, path: string): Promise<void> {
        const template_file_content = fs.readFileSync(path).toString("utf-8");

        const templateParsed = handlebars.compile(template_file_content);

        const templateHTML = templateParsed(variables);

        const message = await this.client.sendMail({
            to: to_user,
            from: "RentX <noreply@rentx.com.br>",
            subject,
            html: templateHTML,
        });

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }

}

export { EtherealMailProvider };