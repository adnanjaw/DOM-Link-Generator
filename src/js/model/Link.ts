export class Link {
    readonly #name: string
    readonly #url: string

    constructor(name: string, url: string) {
        this.#name = name;
        this.#url = url;
    }

    get name() {
        return this.#name;
    }

    get url() {
        return this.#url;
    }

    toObject() {
        return {
            name: this.name,
            url: this.url,
        }
    }

    serialize() {
        return JSON.stringify(this.toObject());
    }

    static fromSerialized(serialized: string) {
        const link: ReturnType<Link["toObject"]> = JSON.parse(serialized);

        return new Link(
            link.name,
            link.url
        );
    }
}