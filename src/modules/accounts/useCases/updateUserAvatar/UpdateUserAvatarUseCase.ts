// Adionar coluna avatar na table "users"
// Refatorar model usuario com coluna "avatar"
// Configuração upload multer
// criar a regra de negocio do upload
// Criar controller

import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/Providers/StorageProvider/IStorageProvider";
import { hashFile } from "@utils/fileHash";

interface IRequest {
    user_id: string;
    avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) { }

    async execute({ user_id, avatarFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(user_id);

        if (user.avatar) {
            await this.storageProvider.delete(user.avatar, "avatar");
        }

        await this.storageProvider.save(avatarFile, "avatar");

        avatarFile = hashFile(avatarFile);

        user.avatar = avatarFile; // reAssignment do valor do objeto 

        // Ao Criar novamente um objeto que já existe no DB, ele altomaticamente faz a atualização
        await this.usersRepository.create(user);
    }
}

export { UpdateUserAvatarUseCase };
