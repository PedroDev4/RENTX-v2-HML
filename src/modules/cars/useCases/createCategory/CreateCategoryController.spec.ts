import { app } from "@shared/infra/http/app";
import request from "supertest";
import createConnection from "@shared/infra/database";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 } from "uuid";

let connection: Connection;
describe("Create Category Controller", () => {

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

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a category by end2end", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com.br",
            password: "admin",
            driver_license: "XXXXX"
        });

        const { token } = responseToken.body;

        const response = await request(app).post("/categories")
            .send({
                name: "Category Supertest Create",
                description: "Category Supertest"
            }).set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(201);
    });

    it("Should NOT be able to create a category with an already existing name", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com.br",
            password: "admin",
            driver_license: "XXXXX"
        });

        const { token } = responseToken.body;

        await request(app).post("/categories")
            .send({
                name: "Category Supertest error",
                description: "Category Supertest"
            }).set({
                Authorization: `Bearer ${token}`
            });

        const response = await request(app).post("/categories")
            .send({
                name: "Category Supertest error",
                description: "Category Supertest"
            }).set({
                Authorization: `Bearer ${token}`
            });

        expect(response.status).toBe(400);
    });

});