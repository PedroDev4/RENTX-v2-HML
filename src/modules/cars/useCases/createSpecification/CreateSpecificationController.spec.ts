import { app } from "@shared/infra/http/app";
import request from "supertest";
import createConnection from "@shared/infra/database";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";

let connection: Connection;
describe("Create Specification Controller", () => {

    beforeAll(async () => {

        connection = await createConnection();
        await connection.runMigrations();

        const id = uuid();
        const password = await hash('admin', 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES('${id}','admin','admin@rentx.com.br','${password}', true, 'now()', 'XXXXX')`
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new Specification", async () => {

        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com.br",
            password: "admin",
            driver_license: "XXXXX"
        });

        const { token } = responseToken.body;
        console.log(token);

        const response = await request(app).post("/specifications")
            .send({
                name: "Specification Test",
                description: "Specification Supertest",
            }).set({
                Authorization: `Bearer ${token}`
            });

        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

});