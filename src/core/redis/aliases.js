import * as keys from './redis-keys.js'
import { redis } from "../../utils/redis.js";
import { generateObjectID } from "../../utils/oid.js";

export const getClaimSha256sByAliases = (...aliases) => redis.hmget(keys.validatorAliases(), ...aliases)
export const existsAlias = alias => redis.hexists(keys.validatorAliases(), alias)
export const createAlias = (alias = generateObjectID(), sha256) => {
    if (sha256)
        redis.hset(keys.validatorAliases(), alias, sha256)
    return alias
}
