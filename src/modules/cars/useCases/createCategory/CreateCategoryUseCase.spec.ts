import { AppError } from "@shared/errors/AppError";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
    beforeEach(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    it("Should be able to create a  new Category", async () => {
        const category = await createCategoryUseCase.execute({
            name: "Category Name Test",
            description: "Category Description Test",
        });

        expect(category).toHaveProperty("id");
    });

    it("Should NOT be able to create a  new Category", async () => {
        await createCategoryUseCase.execute({
            name: "Category Name Test",
            description: "Category Description Test",
        });
        expect(async () => {
            await createCategoryUseCase.execute({
                name: "Category Name Test",
                description: "Category Description Test",
            });
        }).rejects.toStrictEqual(new AppError("Category Already Exists!"));
    });
});
