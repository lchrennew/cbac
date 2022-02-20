export default class UserContext {
    constructor() {

    }

    #serverContext = {}

    get serverContext() {
        return this.#serverContext;
    }

    set serverContext(value) {
        this.#serverContext = value;
    }

    #clientContext = {}

    get clientContext() {
        return this.#clientContext;
    }

    set clientContext(value) {
        this.#clientContext = value;
    }
}
