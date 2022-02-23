import { redis } from "../../utils/redis.js";
import * as keys from './redis-keys.js'

export const saveProps = (access, alias, props) => redis.hset(keys.accessProps(access), alias, JSON.stringify(props))
export const getProps = async (access, alias) => JSON.parse(await redis.hget(keys.accessProps(access), alias))


// export const getPropsByAliases = async (access, ...aliases) => redis.hmget(keys.accessProps(access), ...aliases)
//
// const getAccessRulesByAliases = async (access, ...aliases) => {
//     const propsList = await getPropsByAliases(access, ...aliases)
//     const entries = aliases.map((alias, i) => [ alias, JSON.parse(propsList[i]) ]);
//     return [ access, Object.fromEntries(entries) ]
// }
//
// export const getRules = async (...items) => {
//     const hash = {}
//     items.forEach(({ access, alias }) => {
//         hash[access] ??= []
//         hash[access].push(alias)
//     })
//     const hashEntries = Object.entries(hash)
//     const hashEntryToAccessRules = ([ access, aliases ]) => getAccessRulesByAliases(access, ...aliases);
//     const hashEntriesToAccessRules = hashEntries.map(hashEntryToAccessRules)
//     const rulesEntries = await Promise.all(hashEntriesToAccessRules)
//     return Object.fromEntries(rulesEntries)
// }
