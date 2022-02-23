import { claimSha256 } from "./redis-keys.js";

describe('redis-keys.js', () => {
    test('generate claim', () => {
        expect(claimSha256('123')).toEqual('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3')
        expect(claimSha256('')).toEqual('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    })
})
