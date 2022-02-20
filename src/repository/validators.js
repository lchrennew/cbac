import { redis } from "../utils/redis.js";
import { getLogger } from 'koa-es-template'

const logger = getLogger('repository/validators')
const defaultValidator = { validate: () => true }
const useDefaultValidatorOnError = async process => {
    try {
        return await process
    } catch (error) {
        logger.error(error)
        logger.warn('Default validator will be used due to this error')
        return defaultValidator
    }
}

const importValidator = from => import(from)

const getDeployedValidator = path => importValidator(path)

const getUserDefinedLogic = async name => (await redis.hget('validators', name)) ?? `return true`

const createUserDefinedValidatorDataURL = logic =>
    `data:text/javascript;utf-8,export validate = async (context, props)=>{${logic}}`

const getUserDefinedValidator = async name => {
    const logic = await getUserDefinedLogic(name)
    const dataURL = createUserDefinedValidatorDataURL(logic)
    return importValidator(dataURL)
}

/**
 *
 * @return {Promise<*>}
 * @param location
 * @param deployed
 */
export const getValidator = async (location, deployed = true) => {
    if (!location) return defaultValidator
    const getValidatorFrom = deployed ? getDeployedValidator : getUserDefinedValidator
    const getValidatorFromLocation = () => getValidatorFrom(location)
    return useDefaultValidatorOnError(getValidatorFromLocation)
}
