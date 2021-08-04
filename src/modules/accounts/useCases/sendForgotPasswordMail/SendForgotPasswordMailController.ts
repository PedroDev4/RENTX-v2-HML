import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";


class SendForgotPasswordMailController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { email, driver_license } = request.body;

       const sendForgotPasswordMailUseCase = container.resolve(SendForgotPasswordMailUseCase);

        await sendForgotPasswordMailUseCase.execute(email, driver_license);
       
       return response.send();

    }

}

export { SendForgotPasswordMailController };