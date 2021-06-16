import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import { CreateRentalUseCase } from "./CreateRentalUseCase";


let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
    });

    it("Should be able to create a new Rental", async () => {

        const rental: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: "12344",
            expected_return_date: dayAdd24Hours,
        }

        const createdRental = await createRentalUseCase.execute(rental);

        expect(createdRental).toHaveProperty("id");
        expect(createdRental).toHaveProperty("start_date");
    });

    it("Should NOT be able to create a new rental with an unavailable Car", async () => {

        const rental: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: "123",
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

        const rental: ICreateRentalsDTO = {
            user_id: "1234",
            car_id: "123",
            expected_return_date: dayAdd24Hours,
        }

        await createRentalUseCase.execute(rental);

        expect(async () => {
            const rental2: ICreateRentalsDTO = {
                user_id: rental.user_id,
                car_id: "321",
                expected_return_date: dayAdd24Hours,
            }

            await createRentalUseCase.execute(rental2);
        }).rejects.toBe(new AppError("There's a rental in progress to user."));

    });

    it("Should NOT be able to create a new rental with an invalid return time", async () => {
        expect(async () => {

            const rental: ICreateRentalsDTO = {
                user_id: "444",
                car_id: "321",
                expected_return_date: dayjs().toDate(),
            }

            await createRentalUseCase.execute(rental);
        }).rejects.toBe(new AppError("Minimum rental duration is 24 hours."));

    });

});