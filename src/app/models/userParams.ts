import { User } from "./user";

export class UserParams { // sto klasa a ne interfejs. klasa nam omogucava da imamo interfejs
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(user: User) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}