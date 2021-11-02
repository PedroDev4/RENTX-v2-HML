import request from "supertest";
import { app } from "@shared/infra/http/app";
import { Connection } from "typeorm";
import createConnection from "@shared/infra/database";
import { v4 } from "uuid";
import { hash } from "bcryptjs";


let connection: Connection;
describe('Create Rental Controller ', () => {

    beforeAll(async () => {

        connection = await createConnection();
        await connection.runMigrations();

        const id = v4();
        const password = await hash('admin', 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)VALUES('${id}','admin','admin@rentx.com.br','${password}', true, 'now()', 'XXXXX')`
        );

    });

    afterAll(async () => {

        await connection.dropDatabase();
        await connection.close();

    });

    it('Should be able to create a rental successfully', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: "admin@rentx.com.br",
            password: "admin",
            driver_license: "XXXXX"
        });

        const { token } = responseToken.body;

        const responseCategory = await request(app).post('/categories').send({
            name: "Carro Econômico",
            description: "Categoria de Carros Econômicos"
        }).set({
            Authorization: `Bearer ${token}`
        });

        const { id } = responseCategory.body;

        const responseCar = await request(app).post('/cars').send({
            name: "Honda HRV 2021",
            description: "Carro grande e moderno",
            daily_rate: 220.00,
            fine_amount: 60.00,
            license_plate: "XxXxXx",
            brand: "Honda",
            category_id: `${id}`
        }).set({
            Authorization: `Bearer ${token}`
        })

        const { id: car_id } = responseCar.body;

        const responseRental = await request(app).post('/rentals').send({
            car_id: `${car_id}`,
            expected_return_date: "2021-11-30T18:43:19.172Z"
        }).set({
            Authorization: `Bearer ${token}`
        })

        expect(responseRental.status).toBe(201);
    });


});