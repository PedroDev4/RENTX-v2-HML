import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConfirmUserValidationUseCase } from "./ConfirmUserValidationUseCase";


class ConfirmUserValidationController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { token } = request.query

        const confirmUserValidationUseCase = container.resolve(ConfirmUserValidationUseCase);

        const updatedUser = await confirmUserValidationUseCase.execute(String(token));

        return response.status(200).json(updatedUser);
    }

}

export { ConfirmUserValidationController };