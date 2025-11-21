import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761861111461 implements MigrationInterface {
    name = 'Init1761861111461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` varchar(36) NOT NULL, \`comment\` text NOT NULL, \`rating\` int NOT NULL, \`productId\` varchar(36) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wishlists\` (\`id\` varchar(36) NOT NULL, \`productId\` varchar(36) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_a6b3c434392f5d10ec171043666\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_063c6f46d6cbebf35f3a5ec3d4e\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_4f3c30555daa6ab0b70a1db772c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_4f3c30555daa6ab0b70a1db772c\``);
        await queryRunner.query(`ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_063c6f46d6cbebf35f3a5ec3d4e\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_a6b3c434392f5d10ec171043666\``);
        await queryRunner.query(`DROP TABLE \`wishlists\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
    }

}
