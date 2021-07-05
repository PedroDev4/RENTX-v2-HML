import { Car } from "@modules/cars/infra/typeorm/model/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {

    rental: {
        id: string;
        car_id: string;
        user_id: string;
        expected_return_date: Date;
        created_at: Date;
        updated_at: Date;
    }
    car: Car;
}

@injectable()
class CreateRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
    ) {
        //
    }

    async execute({ user_id, car_id, expected_return_date }: ICreateRentalsDTO): Promise<IResponse> {
        const minimumDuration = 24;

        const car = await this.carsRepository.findById(car_id);

        if (!car) {
            throw new AppError("Car does not exists.");
        }

        // Não deve ser possível cadastrar um novo aluguel caso já eista um aberto para o mesmo carro.
        const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(car_id);

        if (carUnavailable) {
            throw new AppError("Car is not available.");
        }
        // Não deve ser possível cadastrar um novo aluguel caso já eista um aberto para o mesmo usuário.   

        const rentalOpenToUser = await this.rentalsRepository.findByOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress to user.");
        }

        /* O aluguel deve ter duração mínima de 24 horas. */
        const dateNow = this.dateProvider.dateNow();

        const compareHours = this.dateProvider.compareInHours(dateNow, expected_return_date);


        if (compareHours < minimumDuration) {
            throw new AppError("Minimum rental duration is 24 hours.");
        }

        car.available = false;

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date
        });

        const rentalResponse: IResponse = {
            rental,
            car
        }
        return rentalResponse
    }
}

export { CreateRentalUseCase };