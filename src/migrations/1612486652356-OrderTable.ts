import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderTable1612486652356 implements MigrationInterface {
    name = 'OrderTable1612486652356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `order` (`id` int NOT NULL AUTO_INCREMENT, `orderDetailId` int NOT NULL, `userid` int NOT NULL, `amount` int NOT NULL, `merchantId` int NOT NULL, `status` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6), `createdBy` int NOT NULL DEFAULT '0', `updatedBy` int NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `order`");
    }

}
