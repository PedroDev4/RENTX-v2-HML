import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoriesuseCase } from "./ListCategoriesuseCase";

class ListCategoriesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listCategoriesUseCase = container.resolve(ListCategoriesuseCase);

        const allCategories = await listCategoriesUseCase.execute();
        return response.json(allCategories);
    }
}

export { ListCategoriesController };
