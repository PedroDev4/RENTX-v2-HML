import { ICreateCarDTO } from "@modules/cars/DTOs/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../model/Car";


class CarsRepository implements ICarsRepository {

    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }

    async create({ name, description, license_plate, fine_amount, brand, daily_rate, category_id, specifications, id }: ICreateCarDTO): Promise<Car> {

        const car = this.repository.create({
            name,
            description,
            license_plate,
            fine_amount,
            brand,
            daily_rate,
            category_id,
            specifications,
            id,
        })

        await this.repository.save(car);
        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({ license_plate });
        return car;
    }

    async findAvailable(category_id?: string, brand?: string, name?: string): Promise<Car[]> {

        const carsQuery = await this.repository
            .createQueryBuilder("cars")
            .where("available = :available", { available: true })

        if (category_id) {
            carsQuery.andWhere("cars.category_id = :category_id", { category_id })
        }

        if (brand) {
            carsQuery.andWhere("cars.brand = :brand", { brand })
        }

        if (name) {
            carsQuery.andWhere("cars.name = :name", { name })
        }

        const cars = await carsQuery.getMany();

        return cars
    }

    async findById(car_id: string): Promise<Car> {
        const car = await this.repository.findOne({ id: car_id })
        return car;
    }

    async updateAvailableQueryBuilder(car_id: string, available: boolean): Promise<void> {
        await this.repository.createQueryBuilder().update()
            .set({ available })
            .where("id = :car_id")
            .setParameters({ car_id })
            .execute();

        // UPDATE CARS SET AVAILABLE = 'true' WHERE ID = 'car_id';
    }

    async updateAvailableStandard(car_id: string, available: boolean): Promise<void> {
        await this.repository.update(car_id, {
            available: available,
        });
    }

}

export { CarsRepository };