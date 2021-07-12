import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";


interface IRequest {
    rental_id: string;
    user_id: string;
}

@injectable()
class RentalDevolutionUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
    ) {

    }

    async execute({ rental_id, user_id }: IRequest): Promise<Rental> {
        let totalRental = 0;
        const minimumDaily = 1;

        const rental = await this.rentalsRepository.findById(rental_id);

        if (!rental) {
            throw new AppError("Rental does not exists.");
        }

        const car = await this.carsRepository.findById(rental.car_id);

        // Verificar duração do aluguel

        const dateNow = this.dateProvider.dateNow();

        let rentalDaily = this.dateProvider.compareInDays(rental.start_date, dateNow); // Quantidade de Diárias do aluguel
        const delayedDays = this.dateProvider.compareInDays(dateNow, rental.expected_return_date);

        if (rentalDaily <= 0) {
            rentalDaily = minimumDaily;
        }

        if (delayedDays > 1) {
            const fineAmountCalculate = delayedDays * car.fine_amount;
            totalRental = fineAmountCalculate;
        }

        totalRental += rentalDaily * car.daily_rate

        rental.end_date = this.dateProvider.dateNow();
        rental.total = totalRental;

        await this.rentalsRepository.create(rental);
        await this.carsRepository.updateAvailableStandard(car.id, true);

        return rental;

    }

}

export { RentalDevolutionUseCase };