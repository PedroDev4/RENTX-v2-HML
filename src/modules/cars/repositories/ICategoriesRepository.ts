import { Category } from "../model/Category";

// DTO -> Data Transfer Object
interface ICreateCategoryDTO {
    name: string;
    description: string;
}

interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    list(): Promise<Category[]>;
    create({ name, description }: ICreateCategoryDTO): Promise<Category>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
