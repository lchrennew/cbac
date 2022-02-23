import { getLogger } from "koa-es-template";

const logger = getLogger('validator-helper')

const defaultValidator = () => ({ validate: () => true })
const useDefaultValidatorOnError = async process => {
    try {
        return await process()
    } catch (error) {
        logger.error(error)
        logger.warn('Default validator will be used due to this error')
        return defaultValidator()
    }
}
const importValidator = from => import(from)
const getDeployedValidator = path => importValidator(path)
const createUserDefinedValidatorDataURL = logic =>
    `data:text/javascript;utf-8,export const validate = async ({context, props})=>{${logic}}`
const getUserDefinedValidator = async logic => {
    const dataURL = createUserDefinedValidatorDataURL(logic)
    return importValidator(dataURL)
}
/**
 *
 * @param claim
 * @return {Promise<*>}
 */
const getValidator = claim => {
    const { content = '', userDefined = false } = claim ?? {}
    if (!content) return defaultValidator()
    const getValidatorFrom = userDefined ? getUserDefinedValidator : getDeployedValidator
    const getValidatorFromContent = () => getValidatorFrom(content)
    return useDefaultValidatorOnError(getValidatorFromContent)
}
const parseValidatorClaim = claim => getValidator(JSON.parse(claim))

/**
 *
 * @param claims {string[]}
 * @return {Promise<Awaited<unknown>[]>}
 */
export const createValidatorsFromClaims = claims => Promise.all(claims.map(parseValidatorClaim))

export const setAliasForValidator = (alias, validator) => ({ ...validator, alias })

export const setAliasesForValidators =
    (aliases, validators) => validators.map((validator, i) => setAliasForValidator(aliases[i], validator))

export const createFilter = (validators, getProps) => {
    const valid = async ({ access, context }) => {
        for (const { validate, alias } of validators) {
            const props = await getProps(access, alias)
            const result = await validate({ context, props })
            if (!result) return
        }
        return true
    }
    return async (...items) => {
        return await Promise.all(items.map(valid))
    };
}
