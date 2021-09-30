import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/Providers/DateProvider/implementations/DayjsDateProvider";
import { RentalDevolutionUseCase } from "./RentalDevolutionUseCase";
import dayjs from "dayjs";


let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory
let dayjsDateProvider: DayjsDateProvider;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let rentalDevolutionUseCase: RentalDevolutionUseCase;
describe("Rentals Devolution", () => {
    const dayAdd24Hours = dayjs().add(2, "days").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        rentalDevolutionUseCase = new RentalDevolutionUseCase(rentalsRepositoryInMemory, carsRepositoryInMemory, dayjsDateProvider);
    });

    it("Should be able to create a rental devolution", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "UserTest",
            email: "user@test.com.br",
            driver_license: "1234",
            password: "123"
        });

        const car = await carsRepositoryInMemory.create({
            name: "Name Car3",
            description: "Description Car3",
            daily_rate: 100,
            fine_amount: 60,
            license_plate: "1234",
            brand: "Car Brand3",
            category_id: "category3"
        });

        const rental = await rentalsRepositoryInMemory.create({
            car_id: car.id,
            user_id: user.id,
            expected_return_date: dayAdd24Hours
        });

        const rentalDevolutionParameters = {
            rental_id: rental.id,
            user_id: user.id,
        }

        const rentalDevolution = await rentalDevolutionUseCase.execute(rentalDevolutionParameters);

        expect(rentalDevolution).toHaveProperty("total");
        expect(rentalDevolution).toHaveProperty("end_date");
    });

});