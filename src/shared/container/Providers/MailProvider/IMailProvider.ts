

interface IMailProvider {

    sendMail(to_user: string, subject: string, variables: any, path: string): Promise<void>;

}

export { IMailProvider }