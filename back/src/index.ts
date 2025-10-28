import "reflect-metadata";
import { AppDataSource } from "./config/data.source";
import server from "./server";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Base de datos conectada");
        server.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error: Error) => console.log("Error al conectar con la base de datos:", error));
