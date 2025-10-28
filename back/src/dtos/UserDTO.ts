import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, Length, Matches, Min } from 'class-validator';

export class UserRegisterDto {
    @IsNotEmpty({ message: "El nombre es requerido" })
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    @Length(2, 100, { message: "El nombre debe tener entre 2 y 100 caracteres" })
    name: string;

    @IsNotEmpty({ message: "El email es requerido" })
    @IsEmail({}, { message: "El formato del email no es válido" })
    email: string;

    @IsNotEmpty({ message: "La fecha de nacimiento es requerida" })
    @Type(() => Date)
    @IsDate({ message: "La fecha de nacimiento debe ser una fecha válida" })
    birthdate: Date;

    @IsNotEmpty({ message: "El DNI es requerido" })
    @IsInt({ message: "El DNI debe ser un número entero" })
    @Min(1000000, { message: "El DNI debe tener al menos 7 dígitos" })
    nDni: number;

    @IsNotEmpty({ message: "El nombre de usuario es requerido" })
    @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
    @Length(4, 255, { message: "El nombre de usuario debe tener entre 4 y 255 caracteres" })
    username: string;

    @IsNotEmpty({ message: "La contraseña es requerida" })
    @IsString({ message: "La contraseña debe ser una cadena de texto" })
    @Length(8, 255, { message: "La contraseña debe tener entre 8 y 255 caracteres" })
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" }
    )
    password: string;
}

export class UserLoginDto {
    @IsNotEmpty({ message: "El nombre de usuario es requerido" })
    @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
    username: string;

    @IsNotEmpty({ message: "La contraseña es requerida" })
    @IsString({ message: "La contraseña debe ser una cadena de texto" })
    password: string;
}

export class UserDto {
    @IsInt()
    id: number;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsDate()
    birthdate: Date;

    @IsInt()
    nDni: number;
}

export interface UserLoginSuccessDto {
    login: boolean;
    user: UserDto;
    token: string;
}