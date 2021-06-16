import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe("List Available Cars", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    })

    it("Should be able to list all available cars", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Car 1",
            description: "Carro Description 1",
            daily_rate: 200,
            fine_amount: 120,
            license_plate: "xXx-xx",
            brand: "Car Brand 1",
            category_id: "Category Id 1"
        })

        const cars = await listCarsUseCase.execute({
        });

        expect(cars).toEqual([car]); // Esperamos que o retorno seja igual a um array de Car
        expect(cars).toHaveLength(1);

    });

    it("Should be able to list all available cars by category_id", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Car 2",
            description: "Carro Description 2",
            daily_rate: 200,
            fine_amount: 120,
            license_plate: "xXx-xx",
            brand: "Car Brand 2",
            category_id: "CategoryId2"
        })

        const cars = await listCarsUseCase.execute({
            category_id: "CategoryId2",
        });

        expect(cars).toEqual([car]); // Esperamos que o retorno seja igual a um array de Car=

    });

    it("Should be able to list all available cars by category_id", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Car 3",
            description: "Carro Description 3",
            daily_rate: 200,
            fine_amount: 120,
            license_plate: "xXx-xx",
            brand: "Car Brand 3",
            category_id: "CategoryId3"
        })

        const cars = await listCarsUseCase.execute({
            brand: "Car Brand 3",
        });

        expect(cars).toEqual([car]); // Esperamos que o retorno seja igual a um array de Car
    });

    it("Should be able to list all available cars by category_id", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Car 4",
            description: "Carro Description 4",
            daily_rate: 200,
            fine_amount: 120,
            license_plate: "xXx-xx",
            brand: "Car Brand 4",
            category_id: "CategoryId4"
        })

        const cars = await listCarsUseCase.execute({
            name: "Car 4",
        });

        expect(cars).toEqual([car]); // Esperamos que o retorno seja igual a um array de Car
    });

});