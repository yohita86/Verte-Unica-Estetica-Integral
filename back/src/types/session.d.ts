import "express-session";
import { UserDto } from "../dtos/UserDTO";

declare module "express-session" {
  interface SessionData {
    user?: UserDto;
  }
}
