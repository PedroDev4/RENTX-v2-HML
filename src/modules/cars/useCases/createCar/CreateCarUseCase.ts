import { inject, injectable } from "tsyringe";
import { ICreateCarDTO } from "@modules/cars/DTOs/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/model/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateCarUseCase {

    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) {
        //
    }

    async execute({ name, description, daily_rate, fine_amount, license_plate, brand, category_id, }: ICreateCarDTO): Promise<Car> {

        const carExists = await this.carsRepository.findByLicensePlate(license_plate);

        if (carExists) {
            throw new AppError("Car already exists.");
        }

        const car = await this.carsRepository.create({
            name,
            description,
            daily_rate,
            fine_amount,
            license_plate,
            brand,
            category_id
        });

        return car;
    }

}

export { CreateCarUseCase };