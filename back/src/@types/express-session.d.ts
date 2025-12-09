import 'express-session';
import { UserSession } from '../interfaces/UserInterface';

declare module 'express-session' {
  interface SessionData {
    user?: UserSession;
  }
}
