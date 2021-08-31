import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "../IRentalsRepository";


class RentalsRepositoryInMemory implements IRentalsRepository {
    private rentals: Rental[] = [];

    async create({ user_id, car_id, expected_return_date }: ICreateRentalsDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, {
            user_id,
            car_id,
            expected_return_date,
            start_date: new Date()
        });

        this.rentals.push(rental);

        return rental;
    }

    async findOpenRentalByCarId(car_id: string): Promise<Rental> {
        const rental = this.rentals.find((rental) => rental.car_id === car_id && !rental.end_date);
        return rental;
    }

    async findByOpenRentalByUser(user_id: string): Promise<Rental> {
        const rental = this.rentals.find((rental) => rental.user_id === user_id && !rental.end_date);
        return rental;
    }

    async findById(id: string): Promise<Rental> {
        return this.rentals.find(rental => rental.id === id);
    }
    async findByUserId(user_id: string): Promise<Rental[]> {
        return this.rentals.filter((rental) => rental.user_id === user_id);
    }

}

export { RentalsRepositoryInMemory };