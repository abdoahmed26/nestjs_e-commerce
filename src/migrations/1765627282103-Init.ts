import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765627282103 implements MigrationInterface {
    name = 'Init1765627282103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` varchar(36) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(255) NOT NULL DEFAULT 'usd', \`status\` enum ('pending', 'processing', 'succeeded', 'failed', 'refunded') NOT NULL DEFAULT 'pending', \`paymentIntentId\` varchar(255) NULL, \`paymentMethod\` varchar(255) NOT NULL, \`stripeCustomerId\` varchar(255) NULL, \`metadata\` json NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`orderId\` varchar(36) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`paymentStatus\` enum ('pending', 'processing', 'succeeded', 'failed', 'refunded') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`paymentIntentId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`transactionId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_af929a5f2a400fdb6913b4967e1\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_d35cb3c13a18e1ea1705b2817b1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_d35cb3c13a18e1ea1705b2817b1\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_af929a5f2a400fdb6913b4967e1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`transactionId\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`paymentIntentId\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`paymentStatus\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
    }

}
