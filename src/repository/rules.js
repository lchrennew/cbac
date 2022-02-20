import { redis } from "../utils/redis.js";
import { Rule } from "../domain/rule.js";

/**
 *
 * @param query {Object}
 * @return {Promise<{[p: string]: Rule}>}
 */
export const queryRules = async (query = {}) => {

    const keys = Object.keys(query)

    /**
     * @type {Rule[]}
     */
    const rules = (await redis.hmget('rules', ...keys)).map((rule, i) => {

        const access = keys[i]
        if (rule) return new Rule({ ...JSON.parse(rule), access })

        const { props, } = query[access]
        redis.hsetnx('rules', access, JSON.stringify({ props }))
        return new Rule({ access, props })
    })

    return Object.fromEntries(rules.map(rule => [ rule.access, rule ]))

}
