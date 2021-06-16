import { ICreateCarDTO } from "../DTOs/ICreateCarDTO";
import { Car } from "../infra/typeorm/model/Car";

interface ICarsRepository {

    create(data: ICreateCarDTO): Promise<Car>;
    findByLicensePlate(license_plate: string): Promise<Car>;
    findAvailable(category_id?: string, brand?: string, name?: string): Promise<Car[]>;
    findById(car_id: string): Promise<Car>;

}

export { ICarsRepository };