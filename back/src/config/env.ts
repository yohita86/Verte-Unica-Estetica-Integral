import "dotenv/config"
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

export const DB_HOST: string |undefined = process.env.DB_HOST
export const DB_PORT: number |undefined = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined
export const DB_USERNAME: string |undefined = process.env.DB_USERNAME
export const DB_PASSWORD: string |undefined = process.env.DB_PASSWORD
export const DB_DATABASE: string |undefined = process.env.DB_DATABASE
