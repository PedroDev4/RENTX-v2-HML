import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";


let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
describe("Create car Specification", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory, specificationsRepositoryInMemory
        );
    });

    it("Should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Name Car2",
            description: "Description Car2",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand2",
            category_id: "category2"
        });

        const specification = await specificationsRepositoryInMemory.create({
            name: "Specification Name",
            description: "Specification Description"
        });

        const specification2 = await specificationsRepositoryInMemory.create({
            name: "Specification Name",
            description: "Specification Description"
        });

        const car_id = car.id;
        const specifications_id = [specification.id, specification2.id];

        await createCarSpecificationUseCase.execute({ car_id, specifications_id });

        expect(car).toHaveProperty("specifications");
        expect(car.specifications).toHaveLength(2);
    });

    it("Should NOT be able to add a new specification to a non-existent car", async () => {
        expect(async () => {
            const car_id = "1234";

            const specification = await specificationsRepositoryInMemory.create({
                name: "Specification Name",
                description: "Specification Description"
            });

            const specifications_id = [specification.id];

            await createCarSpecificationUseCase.execute({ car_id, specifications_id });
        }).rejects.toStrictEqual(new AppError("Car does not exists"))
    });

    it("Should NOT be able to add a non-existent specification to the car", async () => {
        expect(async () => {
            const car = await carsRepositoryInMemory.create({
                name: "Name Car2",
                description: "Description Car2",
                daily_rate: 100,
                fine_amount: 60,
                license_plate: "1234",
                brand: "Car Brand2",
                category_id: "category2"
            });

            const car_id = car.id;
            const specifications_id = ["321"];

            await createCarSpecificationUseCase.execute({ car_id, specifications_id });
        }).rejects.toStrictEqual(new AppError("Car does not exists"))
    });

});