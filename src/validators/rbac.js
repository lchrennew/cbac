/**
 *
 * @param context {{clientSide:{}, serverSide:{}}}
 * @param props
 * @return {Promise<*>}
 */
export const validate = async ({ context, props }) => {
    const { roles = [] } = props
    return context?.clientSide?.roles?.some?.(role => roles.includes(role)) ?? false
}
