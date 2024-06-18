import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderDetailId: number;

    @Column()
    userid: number;

    @Column()
    amount: number;

    @Column()
    merchantId: number;

    @Column()
    status: string;

    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @UpdateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date;

    @Column({default: 0})
    createdBy: number;

    @Column({default: 0})
    updatedBy: number;
    
}
