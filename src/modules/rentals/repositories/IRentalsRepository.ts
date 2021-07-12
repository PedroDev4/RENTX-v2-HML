import { ICreateRentalsDTO } from "../DTOs/ICreateRentalsDTO";
import { Rental } from "../infra/typeorm/model/Rental";

interface IRentalsRepository {

    create({ id, user_id, car_id, expected_return_date, end_date }: ICreateRentalsDTO): Promise<Rental>;
    findOpenRentalByCarId(car_id: string): Promise<Rental>;
    findByOpenRentalByUser(user_id: string): Promise<Rental>;
    findById(id: string): Promise<Rental>;
    findByUserId(user_id: string): Promise<Rental[]>;

}

export { IRentalsRepository };