import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ICreateRentalsDTO } from "@modules/rentals/DTOs/ICreateRentalsDTO";
import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

dayjs.extend(utc);

class CreateRentalUseCase {

    constructor(
        private rentalsRepository: IRentalsRepository,
    ) {
        //
    }

    async execute({ user_id, car_id, expected_return_date }: ICreateRentalsDTO): Promise<Rental> {
        const minimumDuration = 24;

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
        const dateNow = dayjs().utc().local().format();

        const expected_return_date_formated = dayjs(expected_return_date).utc().local().format();

        const compareHours = dayjs(expected_return_date_formated).diff(dateNow, "hours");


        if (compareHours < minimumDuration) {
            throw new AppError("Minimum rental duration is 24 hours.");
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date
        });

        return rental

    }

}

export { CreateRentalUseCase };