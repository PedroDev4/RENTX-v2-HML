import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";
import { v4 as uuid } from "uuid";
@Entity("users")
class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    driver_license: string;

    @Column()
    isAdmin: boolean;

    @Column()
    avatar: string;

    @Column()
    isVerified?: boolean;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
            this.isAdmin = false;
        }
    }
}

export { User };
