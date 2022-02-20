import { getValidator } from "../repository/validators.js";

export class Rule {
    #props;

    constructor({ access, props, validator }) {
        this.#access = access;
        this.#props = props;
        this.#validator = validator;
    }

    #validator;

    get validator() {
        return getValidator(this.#validator)
    }

    #access;

    get access() {
        return this.#access;
    }

    /**
     *
     * @param context
     * @return {Promise<boolean>}
     */
    async validate(context) {
        return (await this.validator).validate(context, this.#props) ?? true;
    }
}