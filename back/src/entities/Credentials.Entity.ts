import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { IsNotEmpty, IsString, Length, Matches } from "class-validator"
import { User } from "./User.Entity"

@Entity("credentials")
export class Credential {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    @IsNotEmpty({ message: "El nombre de usuario es requerido" })
    @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
    @Length(4, 255, { message: "El nombre de usuario debe tener entre 4 y 255 caracteres" })
    username: string

    @Column({ type: "varchar", length: 255, nullable: false })
    @IsNotEmpty({ message: "La contraseña es requerida" })
    @IsString({ message: "La contraseña debe ser una cadena de texto" })
    @Length(8, 255, { message: "La contraseña debe tener entre 8 y 255 caracteres" })
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        { message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" }
    )
    password: string

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updateAt?: Date

    @OneToOne(() => User, (user) => user.credentials)
    user: User;


}
