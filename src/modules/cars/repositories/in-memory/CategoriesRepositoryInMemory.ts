import { Category } from "@modules/cars/infra/typeorm/model/Category";
import {
    ICategoriesRepository,
    ICreateCategoryDTO,
} from "../ICategoriesRepository";

class CategoriesRepositoryInMemory implements ICategoriesRepository {
    private categories: Category[] = [];

    async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
        const category = new Category();

        Object.assign(category, {
            name,
            description,
        });

        this.categories.push(category);

        return category;
    }

    async findByName(name: string): Promise<Category> {
        const category = this.categories.find(
            (category) => category.name === name
        );

        return category;
    }
    async list(): Promise<Category[]> {
        const all = this.categories;
        return all;
    }
}

export { CategoriesRepositoryInMemory };
