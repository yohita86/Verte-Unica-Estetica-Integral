    import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    } from 'typeorm';
    import { Status } from '../interfaces/AppointmentsInterface';
    import { User } from './User.Entity';
    import { Service } from './Service'; // ✅ importamos Service

    @Entity('appointments')
    export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'varchar', length: 5, nullable: false })
    time: string;

    // ✅ Relación con la tabla services
    @ManyToOne(() => Service, (service) => service.appointments, { nullable: true })
    @JoinColumn()
    service: Service;

    @Column({ type: 'varchar', length: 10, nullable: false, default: Status.Active })
    status: Status;

    @ManyToOne(() => User, (user) => user.appointments, { nullable: false })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
