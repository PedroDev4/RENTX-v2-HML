import { ICreateCarDTO } from "@modules/cars/DTOs/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/model/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
    private cars: Car[] = []

    async create({ name, description, daily_rate, license_plate, brand, fine_amount, category_id, specifications, id }: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            name,
            description,
            daily_rate,
            license_plate,
            brand,
            fine_amount,
            category_id,
            specifications,
            id,
        });

        this.cars.push(car);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = this.cars.find((car) => car.license_plate === license_plate);
        return car;
    }

    async findAvailable(category_id: string, brand: string, name: string): Promise<Car[]> {
        // Using Find return "Only one Object", Filter -> Retowrna um ou Vários 
        const cars = this.cars.filter((car) => (car.available === true) ||
            (category_id && car.category_id === category_id) ||
            (brand && car.brand === brand) ||
            (name && car.name === name));

        return cars;
    }

    async findById(car_id: string): Promise<Car> {
        const car = this.cars.find((car) => car.id === car_id);
        return car;
    }

    async updateAvailableQueryBuilder(car_id: string, available: boolean): Promise<void> {
        const carIndex = this.cars.findIndex((car) => car.id === car_id);
        this.cars[carIndex].available = available;
    }

    async updateAvailableStandard(car_id: string, available: boolean): Promise<void> {
        const carIndex = this.cars.findIndex((car) => car.id === car_id);
        this.cars[carIndex].available = available;
    }

}

export { CarsRepositoryInMemory };