import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/Providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/Providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";



let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;
let dateProvider: DayjsDateProvider;

describe("Send Forgot Mail", () => {

    beforeEach(() => {

        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        mailProviderInMemory = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider, mailProviderInMemory);

    });

    it("Should be able to send a forgot password mail to an user", async () => {

        const sendMail = spyOn(mailProviderInMemory, "sendMail");

        await usersRepositoryInMemory.create({
            name: "Jerome Brady",
            email: "zi@odifu.tn",
            driver_license: "830346",
            password: "282030",
        });

        await sendForgotPasswordMailUseCase.execute("zi@odifu.tn", "830346");

        expect(sendMail).toHaveBeenCalled();

    });

    it("Should not be able to send an email if user does not exists", async () => {

        await expect(
            sendForgotPasswordMailUseCase.execute("pueze@ti.ng", "793567")
        ).rejects.toEqual(new AppError("User does not exists"));

    });

    it("Should be able to create email token", async () => {

        const generatedEmailToken = spyOn(usersTokensRepositoryInMemory, "create");

        await usersRepositoryInMemory.create({
            name: "Mamie Wright",
            email: "ovu@kafo.lk",
            driver_license: "77379",
            password: "282030",
        });

        await sendForgotPasswordMailUseCase.execute("ovu@kafo.lk", "77379");

        expect(generatedEmailToken).toHaveBeenCalled();

    });

});