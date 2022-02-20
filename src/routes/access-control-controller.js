import { Controller } from "koa-es-template";
import { queryRules } from "../repository/rules.js";

export default class AccessControlController extends Controller {
    constructor(config) {
        super(config);
        this.post('/validate', this.validate)
    }

    async validate(ctx) {
        /**
         *
         * @type {{access:string, props: Object, context: {server, client}}[]}
         */
        const items = ctx.request.body

        const rulesQuery = Object.fromEntries(items.map(({ access, props }) => [ access, { access, props } ]))

        const rules = await queryRules(rulesQuery)

        ctx.body = await Promise.all(
            items.map(
                ({ access, context }) =>
                    rules[access].validate(context)))
    }

}
