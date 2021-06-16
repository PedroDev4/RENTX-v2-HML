import { Entity, PrimaryColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Category } from './Category';
import { Specification } from './Specification';

@Entity("cars")
class Car {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    daily_rate: number;

    @Column()
    available: boolean;

    @Column()
    license_plate: string;

    @Column()
    fine_amount: number;

    @Column()
    brand: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category: Category;

    @ManyToMany(() => Specification)
    @JoinTable({
        name: "specifications_cars", // Tabela gerada do relacionamento N:M
        joinColumns: [{ name: "car_id" }], // Chave que referencia o id da Classe em que estamos fazendo o relacionamento
        inverseJoinColumns: [{ name: "specification_id" }] // O Inverso do de cima
    })
    specifications: Specification[];

    @Column()
    category_id: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
        this.available = true;
    }
}

export { Car };