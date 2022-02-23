import { redis } from "../../utils/redis.js";
import * as keys from './redis-keys.js'

export const saveProps = (access, alias, props) => redis.hset(keys.accessProps(access), alias, JSON.stringify(props))
export const getProps = async (access, alias) => JSON.parse(await redis.hget(keys.accessProps(access), alias))
