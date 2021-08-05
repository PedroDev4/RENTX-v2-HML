import { app } from "@shared/infra/http/app";
import request from "supertest";
import createConnection from "@shared/infra/database";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 } from "uuid";

let connection: Connection;
describe("List categories Controller", () => {

    beforeAll(async () => {
        // Criando variavel para receber conexão da função do index.ts que retorna uma Connection
        connection = await createConnection();
        // Rodando as migrations no banco de dados de testes 
        await connection.runMigrations();

        const password = await hash("admin", 8);
        const id = v4();

        // Criando um usuário admin no banco de dados 
        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES('${id}','admin','admin@rentx.com.br','${password}', true, 'now()', 'XXXXX')`
        );
    });

    it("Should be able to list all categories", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com.br",
            password: "admin",
            driver_license: "XXXXX"
        });

        const { refresh_token } = responseToken.body;

        await request(app).post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest"
            }).set({
                Authorization: `Bearer ${refresh_token}`
            });

        const responseAll = await request(app).get("/categories")
            .set({
                Authorization: `Bearer ${refresh_token}`
            });

        expect(responseAll.status).toBe(200);
        expect(responseAll.body).toHaveLength(1);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

});