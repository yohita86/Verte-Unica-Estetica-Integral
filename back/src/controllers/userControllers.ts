import { Request, Response } from "express";
import {
  UserLoginDto,
  UserLoginSuccessDto,
  UserRegisterDto,
  UserDto
} from "../dtos/UserDTO";
import {
  getUserByIdService,
  getUserService,
  loginUserService,
  registerUserService,
} from "../services/usersServices";
import { catchErrors } from "../utils/catchErrors";
import { HttpException } from "../utils/HttpException";

// ✅ Tipo personalizado para incluir sesión
type SessionRequest = Request & {
  session: {
    user?: UserDto;
  };
};

const getUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response = await getUserService();
  res.status(200).json({
    message: "Listado de usuarios obtenido exitosamente",
    data: response,
  });
};

const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const response = await getUserByIdService(id);
  if (!response) {
    throw new HttpException(404, "Usuario no encontrado");
  }
  res.status(200).json({
    message: "Usuario encontrado exitosamente",
    data: response,
  });
};

const registerUserController = async (
  req: Request<unknown, unknown, UserRegisterDto>,
  res: Response
): Promise<void> => {
  const userDto = new UserRegisterDto();
  Object.assign(userDto, req.body);
  await registerUserService(userDto);
  res.status(201).json({
    message: "Usuario registrado exitosamente",
  });
};

const loginUserController = async (
  req: SessionRequest,
  res: Response
): Promise<void> => {
  const loginDto = new UserLoginDto();
  Object.assign(loginDto, req.body);

  const response: UserLoginSuccessDto = await loginUserService(loginDto);
  if (!response) {
    throw new HttpException(401, "Credenciales inválidas");
  }

  // Guardar usuario en sesión
  req.session.user = response.user;

  res.status(200).json({
    message: "Inicio de sesión exitoso",
    user: response.user,
  });
};

const loginUserControllerWithErrorHandling = (
  req: SessionRequest,
  res: Response,
  next: any
) => {
  return loginUserController(req, res).catch(next);
};

const userControllers = {
  getUsersController: catchErrors(getUsersController),
  getUserByIdController: catchErrors(getUserByIdController),
  registerUserController: catchErrors(registerUserController),
  loginUserController: loginUserControllerWithErrorHandling,
};

export default userControllers;
