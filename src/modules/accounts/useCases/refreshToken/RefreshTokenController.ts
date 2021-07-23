import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";


class RefreshTokenController {

    async handle(request: Request, response: Response): Promise<Response> {

        const refresh_token = request.body.token || request.headers["x-access-token"]
            || request.query.token

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

        const new_refresh_token = await refreshTokenUseCase.execute(refresh_token);

        return response.status(201).json(new_refresh_token);

    }

}

export { RefreshTokenController };