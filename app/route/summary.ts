/**
 * Summary Routes
 */

import { controller } from '../controller/summary';
import { Route } from './route';

export const route: Route = {
    /**
     * Init route
     *
     * @param server
     */
    init(server) {
        /**
         * @api {get} /:versionNumber/summary Fetch
         * @apiName GetHydrationSummary
         * @apiGroup Summary
         * @apiDescription Get hydration summary, in daily, weekly or monthly average
         * @apiPermission Private
         * @apiVersion 1.0.0
         *
         * @apiUse VersionNumber
         * @apiParam {String} account The client id
         * @apiParam {Date} startDate Select data that starts at or after this time, in 'YYYY-MM-DD' format.
         * @apiParam {Date} [endDate] Select data that ends at or before this time, in 'YYYY-MM-DD' format. Todays date is default if left blank
         * @apiParam {String} unit The unit of time that the results should be returned in (day|week|month).  Keep in mind that the general fetch hydration endpoint returns the daily data
         *
         * @apiSuccess {Array} hydration An object of hydration arrays
         * @apiSuccess {String} hydration.date The date that starts the week or month
         * @apiSuccess {Integer} hydration.total The total number of mL drank over this period
         * @apiSuccess {Integer} hydration.max The maximum number of mL drank on any one day of this period
         * @apiSuccess {Integer} hydration.average The average number of mL drank on any day within this period
         *
         * @apiSuccessExample {json} Success-Response:
         * [
         *      {
         *          "date" : "2016-01-01",
         *          "total" : 7000,
         *          "max" : 7000,
         *          "average" : 1000
         *      },
         *      {
         *          "date" : "2016-01-08",
         *          "total" : 7000,
         *          "max" : 7000,
         *          "average" : 1000
         *      }
         * ]
         *
         */
        server.get({ path: '/summary', version: '1.0.0' }, controller.fetchSummary);
    }
};
