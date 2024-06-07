import MD5 from "crypto-js/md5";

export class SimpleContent{
    id?: string;
    content: string = "";

    toDTO() {
        return {
            id: this.id,
            content: this.content,
        };
    }

    static fromDTO(dto: any) {
        const content = new SimpleContent();
        content.id = dto.id;
        content.content = dto.content;
        return content;
    }

    getKey() {
        return MD5(JSON.stringify(this.toDTO())).toString();
    }
}

