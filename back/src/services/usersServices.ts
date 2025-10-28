import { AppDataSource, UserModel } from "../config/data.source";
import {
  UserDto,
  UserLoginDto,
  UserLoginSuccessDto,
  UserRegisterDto,
} from "../dtos/UserDTO";
import { User } from "../entities/User.Entity";
import { CustomError } from "../utils/customError";
import { QueryFailedError } from "typeorm";
// import IUser from "../interfaces/UserInterface";
import {
  checkCredentials,
  createCredentialService,
} from "./credentialServices";

export const getUserService = async (): Promise<UserDto[]> => {
  const users: User[] = await UserModel.find();
  return users;
};

export const getUserByIdService = async (id: string): Promise<UserDto> => {
  const userFound = await UserModel.findOne({
    where: {
      id: parseInt(id, 10),
    },
    relations: ["appointments"],
  });

  if (!userFound)
    throw new CustomError(404, `El usuario con id ${id} no fué encontrado`);
  else return userFound;
};

export const registerUserService = async (
  user: UserRegisterDto
): Promise<User> => {
  try {
  const result = await AppDataSource.transaction(async (entityManager) => {
      // Crear las credenciales primero
      const userCredentials = await createCredentialService(
      entityManager,
      user.username,
      user.password
    );

      // Validar y procesar la fecha de nacimiento
      let birthdate: Date;
      try {
        birthdate = new Date(user.birthdate);
        if (isNaN(birthdate.getTime())) {
          throw new CustomError(400, "Fecha de nacimiento inválida.");
        }
      } catch {
        throw new CustomError(400, "Error al procesar la fecha de nacimiento.");
    }

      // Validar y convertir nDni
    const nDni = parseInt(user.nDni.toString(), 10);
    if (isNaN(nDni)) {
      throw new CustomError(400, "nDni debe ser un número entero válido.");
    }

      // Crear el nuevo usuario
      const newUser = entityManager.create(User, {
      name: user.name,
        birthdate: birthdate,
      email: user.email,
        nDni: nDni,
        credentials: userCredentials
    });

      // Guardar el usuario
    return await entityManager.save(newUser);
  });

  return result;
  } catch (error: unknown) {
    if (
      error instanceof QueryFailedError &&
      error.driverError?.code === "23505"
    ) {
      throw new CustomError(409, "Ya existe un usuario con ese DNI, email o nombre de usuario.");
    }
    if (error instanceof CustomError) {
      throw error;
    }
    console.error("Error en registerUserService:", error);
    throw new CustomError(500, "Error en el proceso de registro");
  }
};

export const loginUserService = async (
  user: UserLoginDto
): Promise<UserLoginSuccessDto> => {
  const credentialId: number | undefined = await checkCredentials(
    user.username,
    user.password
  );

  if (!credentialId) {
    throw new CustomError(401, "La contraseña es incorrecta o el usuario no existe");
  }

  const userFound: User | null = await UserModel.findOne({
    where: {
      credentials: {
        id: credentialId,
      },
    },
  });

  if (!userFound) {
    throw new CustomError(404, "El usuario no existe");
  }

  return {
    login: true,
    user: {
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      birthdate: userFound.birthdate,
      nDni: userFound.nDni,
    },
    token: "true", // TODO: Implementar JWT
  };
};
