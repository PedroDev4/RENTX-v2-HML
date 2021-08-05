import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayjsDateProvider } from "@shared/container/Providers/DateProvider/implementations/DayjsDateProvider";
import dayjs from "dayjs";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").utc().toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, carsRepositoryInMemory, dayjsDateProvider);
    });

    it("Should be able to create a new Rental", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Name Car1",
            description: "Description Car1",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand1",
            category_id: "category1"
        });

        const rentalCreate: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        }

        const { rental } = await createRentalUseCase.execute(rentalCreate);

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should NOT be able to create a new rental with an unavailable Car", async () => {

        const car2 = await carsRepositoryInMemory.create({
            name: "Name Car2",
            description: "Description Car2",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand2",
            category_id: "category2"
        });

        const rental: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: car2.id,
            expected_return_date: dayAdd24Hours,
        }

        await createRentalUseCase.execute(rental);

        expect(async () => {
            const rental2: ICreateRentalsDTO = {
                user_id: "1234",
                car_id: rental.car_id,
                expected_return_date: dayAdd24Hours,
            }

            await createRentalUseCase.execute(rental2);
        }).rejects.toBe(new AppError("Car is not available."));

    });

    it("Should NOT be able to create a new rental with one already opened rental to the user", async () => {

        const car3 = await carsRepositoryInMemory.create({
            name: "Name Car3",
            description: "Description Car3",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand3",
            category_id: "category3"
        });

        const rental: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: car3.id,
            expected_return_date: dayAdd24Hours,
        }

        await createRentalUseCase.execute(rental);

        expect(async () => {
            const rental3: ICreateRentalsDTO = {
                user_id: rental.user_id,
                car_id: "321",
                expected_return_date: dayAdd24Hours,
            }

            await createRentalUseCase.execute(rental3);
        }).rejects.toEqual(new AppError("There's a rental in progress to user."));

    });

    it("Should NOT be able to create a new rental with an invalid return time", async () => {
        const car4 = await carsRepositoryInMemory.create({
            name: "Name Car3",
            description: "Description Car3",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand3",
            category_id: "category3"
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "123",
                car_id: car4.id,
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Minimum rental duration is 24 hours."));

    });

});