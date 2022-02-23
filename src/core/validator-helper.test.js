import { createFilter } from "./validator-helper.js";
import { getProps } from "./redis/props.js";

describe('validator-helper.js', () => {
    test('createFilter', async () => {
        const validators = [
            { validate: async () => true }
        ]
        const validate = createFilter(validators, getProps)
        const result = await validate({})
        expect(result).toEqual([ 0 ])
    })
});
