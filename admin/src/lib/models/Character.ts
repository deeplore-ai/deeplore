import MD5 from "crypto-js/md5";

import Category from "./Category";

export default class Character {
    id?: string;
    firstname: string = "";
    lastname: string = "";
    behavior: Category[] = [];
    knowledges: Category[] = [];

    toDTO() {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            behavior: this.behavior.map((category) => category.toDTO()),
            knowledges: this.knowledges.map((category) => category.toDTO()),
        };
    }

    static fromDTO(dto: any) {
        const character = new Character();
        character.id = dto.id;
        character.firstname = dto.firstname;
        character.lastname = dto.lastname;
        character.behavior = dto.behavior ? dto.behavior.map((category: any) => Category.fromDTO(category)) : [];
        character.knowledges = dto.knowledges ? dto.knowledges.map((category: any) => Category.fromDTO(category)) : [];
        return character;
    }

    getKey() {
        return MD5(JSON.stringify(this.toDTO())).toString();
    }
}

