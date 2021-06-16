import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { Category } from "@modules/cars/infra/typeorm/model/Category";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {
        //
    }

    async execute({ name, description }: IRequest): Promise<Category> {
        const categoryAlreadyExists = await this.categoriesRepository.findByName(
            name
        );

        if (categoryAlreadyExists) {
            throw new AppError("Category Already Exists!");
        }

        const category = await this.categoriesRepository.create({
            name,
            description,
        });

        return category;
    }
}

export { CreateCategoryUseCase };
