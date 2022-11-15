import {Link} from "./Link";

export class DynamicLink extends Link {
    readonly #azureFieldName: string

    constructor(name: string, url: string, azureFieldName: string) {
        super(name, url);
        this.#azureFieldName = azureFieldName
    }

    get azureFieldName() {
        return this.#azureFieldName;
    }

    toObject() {
        return {
            name: this.name,
            url: this.url,
            azureFieldName: this.#azureFieldName
        }
    }

    serialize() {
        return JSON.stringify(this.toObject());
    }

    static fromSerialized(serialized: string) {
        const link: ReturnType<DynamicLink["toObject"]> = JSON.parse(serialized);

        return new DynamicLink(
            link.name,
            link.url,
            link.azureFieldName
        );
    }
}