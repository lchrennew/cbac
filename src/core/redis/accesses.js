import * as keys from './redis-keys.js'
import { redis } from "../../utils/redis.js";

export const getAccesses = async () => (await redis.hvals(keys.accesses())).map(access => JSON.parse(access))
export const saveAccess = (access, info) =>
    redis.hset(keys.accesses(), access, JSON.stringify({ ...info, access }))
export const deleteAccess = access => redis.hdel(keys.accesses(), access)
