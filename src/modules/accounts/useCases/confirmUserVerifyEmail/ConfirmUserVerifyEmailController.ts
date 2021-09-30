import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConfirmUserVerifyEmailUseCase } from "./ConfirmUserVerifyEmailUseCase";

class ConfirmUserVerifyEmailController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { email } = request.body;

        const confirmUserVerifyEmailUseCase = container.resolve(ConfirmUserVerifyEmailUseCase);

        await confirmUserVerifyEmailUseCase.execute(id, email);

        return response.status(201).send();
    }

}

export { ConfirmUserVerifyEmailController };