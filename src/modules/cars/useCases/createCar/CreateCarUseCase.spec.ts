import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";


let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe("Create Car", () => {

    beforeEach(() => {

        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    })

    it("Should be able to create a new Car", async () => {

        const car = await createCarUseCase.execute({
            name: "Name Car1",
            description: "Description Car1",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand1",
            category_id: "category1"
        });
        expect(car).toHaveProperty("id");
    });

    it("Should be able to create a car with Availability by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car2",
            description: "Description Car2",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand2",
            category_id: "category2"
        });

        expect(car.available).toBe(true);

    });

    it("Should not be able to create a new car with an already existent license_plate", async () => {

        await createCarUseCase.execute({
            name: "Name Car3",
            description: "Description Car3",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand3",
            category_id: "category3"
        });

        expect(async () => {
            await createCarUseCase.execute({
                name: "Name Car3",
                description: "Description Car2",
                daily_rate: 100,
                fine_amount: 60,
                license_plate: "1234",
                brand: "Car Brand3",
                category_id: "category3"
            });
        }).rejects.toStrictEqual(new AppError("Car already exists."));

    });



});