/**
 *
 * @param context {UserContext}
 * @param props
 * @return {Promise<*>}
 */
export const validate = async (context, props) => {
    const { roles = [] } = props
    return context?.clientContext?.roles?.some?.(role => roles.includes(role)) ?? false
}
