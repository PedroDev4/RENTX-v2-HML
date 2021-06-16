import { v4 as uuid } from "uuid";

class Rental {

    id: string;
    car_id: string;
    user_id: string;
    start_date: Date;
    end_date: Date;
    expected_return_date: string;
    total: number;
    created_at: Date;
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }

}

export { Rental };