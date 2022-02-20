import { Controller } from "koa-es-template";
import AccessControlController from "./access-control-controller.js";

export default class Index extends Controller {
    constructor(config) {
        super(config);
        this.get('/', async ctx => ctx.body = {})
        this.use('/access-control', new AccessControlController(config))
    }

}
