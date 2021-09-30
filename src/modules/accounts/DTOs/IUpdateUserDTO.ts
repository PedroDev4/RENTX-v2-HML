

interface IUpdateUserDTO {

    id: string;
    name?: string;
    password?: string;
    email?: string;
    driver_license?: string;
    avatar?: string;
    isVerified?: boolean;

}

export { IUpdateUserDTO };