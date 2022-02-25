import { Controller } from "koa-es-template";
import { createFilter } from "../core/validator-helper.js";
import {
    getAccessAliases,
    getAccessValidators,
    getGlobalAliases,
    getGlobalValidators,
    saveAccessValidators,
    saveGlobalValidators
} from "../core/redis/validators.js";
import { getClaimsByAlias } from "../core/redis/claims.js";
import { getProps, saveProps } from "../core/redis/props.js";
import { existsAlias } from "../core/redis/aliases.js";
import { deleteAccess, getAccesses, saveAccess } from "../core/redis/accesses.js";

export default class AccessControlController extends Controller {
    constructor(config) {
        super(config);
        this.post('/validate', this.validate)
        this.post('/global', this.saveGlobalValidators)
        this.get('/global', this.getGlobalValidators)
        this.post('/access/:access/validators', this.saveAccessValidators)
        this.post('/access/:access/:alias/props', this.saveAccessProps)
        this.get('/access/:access/:alias/props', this.getAccessProps)
        this.get('/access/:access/validators', this.getAccessValidators)
        this.get('/access', this.getAccesses)
        this.post('/access/:access', this.saveAccess)
        this.delete('/access/:access', this.deleteAccess)
        this.get('/alias/exists', this.aliasExists)
    }

    async validate(ctx) {
        /**
         *
         * @type {{access:string, context: {serverSide:Object?, clientSide:Object?}}[]}
         */
        const items = ctx.request.body

        const globalValidators = await getGlobalValidators()
        const globalFilter = createFilter(globalValidators, getProps)
        const globalPassed = await globalFilter(...items)

        const accessesFilter = globalPassed.map(async (valid, i) => {
            if (!valid) return
            const item = items[i]
            const { access } = item
            const validators = await getAccessValidators(access)
            const filter = createFilter(validators, getProps)
            return (await filter(item)).every(r => r)
        })

        ctx.body = await Promise.all(accessesFilter)
    }

    async saveGlobalValidators(ctx) {
        const validators = ctx.request.body
        this.logger.info(validators)
        saveGlobalValidators(...validators)
        ctx.body = { ok: true }
    }

    async getGlobalValidators(ctx) {
        const aliases = await getGlobalAliases()
        if (!aliases.length) {
            ctx.body = []
            return
        }
        const claims = await getClaimsByAlias(...aliases)
        ctx.body = aliases.map((alias, i) => ({ alias, claim: JSON.parse(claims[i]) }))
    }

    async saveAccessValidators(ctx) {
        const { access } = ctx.params
        /**
         *
         * @type {[]}
         */
        const validators = ctx.request.body
        const aliases = await saveAccessValidators(access, ...validators)
        ctx.body = { ok: true, data: aliases }
    }

    async getAccessValidators(ctx) {
        const { access } = ctx.params
        ctx.body = await getAccessAliases(access)
    }

    async aliasExists(ctx) {
        const { alias = '' } = ctx.query

        ctx.body = { ok: !!(await existsAlias(alias)) }
    }

    async saveAccessProps(ctx) {
        const { access, alias } = ctx.params
        const props = ctx.request.body
        saveProps(access, alias, props)
        ctx.body = { ok: true }
    }

    async getAccessProps(ctx) {
        const { access, alias } = ctx.params
        ctx.body = await getProps(access, alias)
    }

    async getAccesses(ctx) {
        ctx.body = await getAccesses()
    }

    async saveAccess(ctx) {
        const { access } = ctx.params
        const info = ctx.request.body
        saveAccess(access, info)
        ctx.body = { ok: true }
    }

    async deleteAccess(ctx) {
        const { access } = ctx.params
        deleteAccess(access)
        ctx.body = { ok: true }
    }
}
