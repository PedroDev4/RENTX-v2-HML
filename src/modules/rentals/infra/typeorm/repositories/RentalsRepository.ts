import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../model/Rental";


class RentalsRepository implements IRentalsRepository {

    private respository: Repository<Rental>;

    constructor() {
        this.respository = getRepository(Rental);
    }

    async create({ id, user_id, car_id, expected_return_date, end_date, total }: ICreateRentalsDTO): Promise<Rental> {
        const rental = this.respository.create({
            user_id,
            car_id,
            expected_return_date,
            id,
            end_date,
            total
        });

        await this.respository.save(rental);

        return rental;
    }

    async findOpenRentalByCarId(car_id: string): Promise<Rental> {
        const rental = await this.respository.findOne({
            where: [
                { car_id: car_id, end_date: null }
            ]
        });

        return rental;
    }

    async findByOpenRentalByUser(user_id: string): Promise<Rental> {
        const rental = await this.respository.findOne({
            where: [
                { user_id: user_id, end_date: null }
            ]
        });

        return rental;
    }

    async findById(id: string): Promise<Rental> {
        const rental = await this.respository.findOne({ id });
        return rental;
    }

    async findByUserId(user_id: string): Promise<Rental[]> {
        const rentals = await this.respository.find({
            where: { user_id: user_id },
            relations: ["car"],
        });

        return rentals;
    }

}

export { RentalsRepository };