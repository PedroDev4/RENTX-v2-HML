import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSpecificationuseCase } from "./CreateSpecificationuseCase";

class CreateSpecificationController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;

        const createSpecificationsUseCase = container.resolve(
            CreateSpecificationuseCase
        );

        const specification = await createSpecificationsUseCase.execute({
            name,
            description,
        });

        return response.status(201).json(specification);
    }
}

export { CreateSpecificationController };
