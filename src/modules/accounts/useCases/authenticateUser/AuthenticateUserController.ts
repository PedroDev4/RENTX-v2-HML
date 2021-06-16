import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password, driver_license } = request.body;

        const authenticateUserUseCase = container.resolve(
            AuthenticateUserUseCase
        );

        const token = await authenticateUserUseCase.execute({
            email,
            password,
            driver_license,
        });

        return response.json(token);
    }
}

export { AuthenticateUserController };
