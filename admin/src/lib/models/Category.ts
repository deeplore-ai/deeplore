export default class Category {
    name: string = "";
    content: string = "";

    toDTO() {
        return {
            name: this.name,
            content: this.content,
        };
    }

    static fromDTO(dto: any) {
        const category = new Category();
        category.name = dto.name;
        category.content = dto.content;
        return category;
    }
}

