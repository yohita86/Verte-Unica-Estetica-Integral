import { AppDataSource } from "../config/data.source";
import { Service } from "../entities/Service";

export const getAllServices = async () => {
    const repo = AppDataSource.getRepository(Service);
    return await repo.find();
};
