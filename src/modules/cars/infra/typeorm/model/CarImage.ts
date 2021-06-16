import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Car } from "./Car";
import { v4 as uuid } from "uuid";

@Entity("cars_image")
class CarImage {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Car)
    @JoinColumn({ name: "car_id" }) // Campo da tabela atual que vai referenciar o id da tabela estrangeira
    car: Car;

    @Column()
    car_id: string;

    @Column()
    image_name: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }

}

export { CarImage };