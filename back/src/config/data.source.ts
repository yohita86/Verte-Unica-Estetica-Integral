import { DataSource, Repository } from "typeorm"
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./env"
import { User } from "../entities/User.Entity"
import { Credential } from "../entities/Credentials.Entity"
import { Appointment } from "../entities/Appointment.Entity"
import { Service } from "../entities/Service";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [User, Credential, Appointment, Service],
    // dropSchema: true,
    subscribers: [],
    migrations: ["src/migrations/*.ts"], // o ajustá la ruta si usás otra estructura

})

// Inicializar los repositorios después de que la conexión esté lista
let UserModel: Repository<User>;
let CredentialModel: Repository<Credential>;
let AppointmentModel: Repository<Appointment>;

AppDataSource.initialize()
    .then(() => {
        UserModel = AppDataSource.getRepository(User);
        CredentialModel = AppDataSource.getRepository(Credential);
        AppointmentModel = AppDataSource.getRepository(Appointment);
    })
    .catch((error) => console.log("Error al inicializar los repositorios:", error));

export { UserModel, CredentialModel, AppointmentModel };