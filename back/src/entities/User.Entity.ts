import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { Credential } from "./Credentials.Entity";
import { Appointment } from "./Appointment.Entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @Length(2, 100, { message: "El nombre debe tener entre 2 y 100 caracteres" })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  @IsNotEmpty({ message: "El email es requerido" })
  @IsEmail({}, { message: "El formato del email no es válido" })
  email: string;

  @Column({ type: "date", nullable: false })
  @IsNotEmpty({ message: "La fecha de nacimiento es requerida" })
  @Type(() => Date)
  @IsDate({ message: "La fecha de nacimiento debe ser una fecha válida" })
  birthdate: Date;

  @Column({ type: "integer", nullable: false, unique: true })
  @IsNotEmpty({ message: "El DNI es requerido" })
  @IsInt({ message: "El DNI debe ser un número entero" })
  @Min(1000000, { message: "El DNI debe tener al menos 7 dígitos" })
  nDni: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;

  @OneToOne(() => Credential, { cascade: true })
  @JoinColumn()
  @IsNotEmpty({ message: "Las credenciales son requeridas" })
  credentials: Credential;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
