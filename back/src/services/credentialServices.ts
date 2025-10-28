// import { Credential } from "../interfaces/CredentialsInterfaces"
import { EntityManager } from "typeorm"
import { Credential } from "../entities/Credentials.Entity"
import { CredentialModel } from "../config/data.source"
import { CustomError } from "../utils/customError"
import crypto from "crypto"


const crypPass = (password: string): string => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

export const createCredentialService: (entityManager: EntityManager, a: string, b:string) => Promise<Credential> = async (entityManager:EntityManager, username: string, password: string): Promise<Credential>=> {
    try {
        // Validar que el username no exista
        const existingCredential = await CredentialModel.findOne({
            where: { username }
        });

        if (existingCredential) {
            throw new CustomError(400, "El nombre de usuario ya está en uso");
        }

        const passwordEncripted: string = crypPass(password);
        
        const credentials: Credential = entityManager.create(Credential, {
            username,
            password: passwordEncripted
        });

        try {
            return await entityManager.save(credentials);
        } catch (error) {
            console.error("Error al guardar credenciales:", error);
            throw new CustomError(500, "Error al crear las credenciales del usuario");
        }
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error("Error en createCredentialService:", error);
        throw new CustomError(500, "Error al procesar las credenciales");
    }
}

export const checkCredentials = async (username: string, password: string): Promise<number | undefined> => {
    const usernameFound: Credential | null = await CredentialModel.findOne({
        where: {
            username: username
        }
    })
    
    const crypPassword: string = crypPass(password)
    if (!usernameFound) throw new CustomError(400, `El usuario ${username} no fué encontrado`)
    if (usernameFound.password !== crypPassword) throw new CustomError(400, "La contraseña es incorrecta")
    else return usernameFound.id
}