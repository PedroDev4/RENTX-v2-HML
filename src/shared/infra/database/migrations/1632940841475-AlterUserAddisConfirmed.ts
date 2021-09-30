import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUserAddisConfirmed1632940841475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "isVerified",
                type: "boolean",
                default: false,
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "isVerified");
    }

}
