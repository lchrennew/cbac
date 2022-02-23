import { createClaim, getClaimsByAlias } from "./claims.js";
import * as keys from './redis-keys.js'
import { redis } from "../../utils/redis.js";
import { createValidatorsFromClaims, setAliasesForValidators } from "../validator-helper.js";
import { createAlias } from "./aliases.js";

const saveValidator = (alias, claim) => createAlias(alias, createClaim(claim))

const saveValidators = (...validators) => validators.map(({ alias, claim, }) => saveValidator(alias, claim))

const clearGlobalValidators = () => redis.unlink(keys.globalValidators())

export const saveGlobalValidators = (...validators) => {
    if (!validators?.length) return
    const aliases = saveValidators(...validators)
    clearGlobalValidators()
    redis.rpush(keys.globalValidators(), ...aliases)
}

export const getGlobalAliases = () => redis.lrange(keys.globalValidators(), 0, -1)

const clearAccessValidators = access => redis.unlink(keys.accessValidators(access))

export const saveAccessValidators = (access, ...validators) => {
    if (!validators?.length) return []
    const aliases = saveValidators(...validators)
    clearAccessValidators(access)
    redis.rpush(keys.accessValidators(access), ...aliases)
    return aliases
}

export const getAccessAliases = access => redis.lrange(keys.accessValidators(access), 0, -1)

export const getAccessValidators = async access => {
    const aliases = await getAccessAliases(access)
    return getValidatorsByAliases(...aliases)
}

/**
 *
 * @return {Promise<Awaited<{validate: ({context:Object, props:Object})=>Promise<Boolean> }>[]>}
 */
export const getGlobalValidators = async () => {
    const aliases = await getGlobalAliases()
    return getValidatorsByAliases(...aliases)
}

const getValidatorsByAliases = async (...aliases) => {
    if (!aliases?.length) return []
    const claims = await getClaimsByAlias(...aliases)
    const validators = await createValidatorsFromClaims(claims)
    return setAliasesForValidators(aliases, validators)
}
