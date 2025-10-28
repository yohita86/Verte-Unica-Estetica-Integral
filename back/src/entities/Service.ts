    import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
    } from "typeorm";
    import { Appointment } from "./Appointment.Entity";

    @Entity("services")
    export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50 })
    duration: string;

    @OneToMany(() => Appointment, (appointment) => appointment.service)
    appointments: Appointment[];
}
