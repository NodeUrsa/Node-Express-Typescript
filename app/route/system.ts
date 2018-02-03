/**
 * System Routes
 */

import { controller } from '../controller/system';
import { Route } from './route';

export const route: Route = {
    /**
     * Init route
     *
     * @param server
     */
    init(server) {
        /**
         * @api {get} /:versionNumber/system Service Health
         * @apiVersion 1.0.0
         * @apiName ServiceHealth
         * @apiGroup System
         * @apiDescription Indicates if system and database are available
         *
         * @apiUse VersionNumber
         */
        server.get({ path: '/system', version: '1.0.0' }, controller.health);
    }
};
