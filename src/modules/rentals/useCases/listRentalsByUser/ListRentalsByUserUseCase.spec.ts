import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";
import { ICreateRentalsDTO } from "../../DTOs/ICreateRentalsDTO";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

let listRentalsByUserUseCase: ListRentalsByUserUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Listing logged user rentals", () => {
    const dateNow = dayjs().utc().local().format();

    beforeEach(() => {

        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        listRentalsByUserUseCase = new ListRentalsByUserUseCase(rentalsRepositoryInMemory);

    });

    it("Should be able to list rentals for existing user", async () => {

        const rental: ICreateRentalsDTO = {

            user_id: "12345",
            car_id: "1234",
            expected_return_date: dayjs(dateNow).add(2, "days").toDate(),
        }

        const rental2: ICreateRentalsDTO = {

            id: "31231313",
            user_id: "12345",
            car_id: "1234222",
            expected_return_date: dayjs(dateNow).add(2, "days").toDate(),
            end_date: dayjs(dateNow).add(4, "days").toDate(),
            total: 340.00
        }

        await rentalsRepositoryInMemory.create(rental);
        await rentalsRepositoryInMemory.create(rental2);

        const rentals = await listRentalsByUserUseCase.execute(rental.user_id);

        expect(rentals).toHaveLength(2);

    });

});