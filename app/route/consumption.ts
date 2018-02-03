/**
 * Consumption Routes
 */
import { controller } from '../controller/consumption';
import { Route } from './route';

export const route: Route = {
    /**
     * Init routes
     *
     * @param server
     *
     */
    init(server) {
        /**
         * @api {get} /:versionNumber/consumption Fetch
         * @apiName GetHydration
         * @apiGroup Hydration
         * @apiDescription Get hydration, returns a maximum of 25 matching entries, ordered by hydration start date.
         * @apiPermission Private
         * @apiVersion 1.0.0
         *
         * @apiUse VersionNumber
         * @apiParam {Integer} [offset] Number of entries to offset from beginning of query.
         * @apiParam {String} account Only fetch hydration which are associated with this account.
         * @apiParam {String} [startDate] Date passed as the start time being passed, if not passed, defaults to current day.
         * @apiParam {String} [endDate] Date passed as the end time being passed.
         * @apiParam {String} [order] The order to return the data in (dateAsc|dateDesc).  Defaults to dateAsc
         *
         * @apiSuccess {Array} hydration An object of hydration arrays
         * @apiSuccess {Object} hydration.date Returns array that contains an object with a hydration quantity. Key is actual date
         * @apiSuccess {Object} pagination
         * @apiSuccess {Integer} pagination.next Offset to retrieve the next result set
         * @apiSuccess {Integer} pagination.prev Offset to retrieve the previous result set
         *
         * @apiSuccessExample {json} Success-Response:
         * {
         * 		"hydration": {
         * 			"2016-12-05" : {"quantity": 5},
         * 			"2016-12-06" : {"quantity": 4}
         * 		}
         * },
         * 	"pagination": {
         * 	"next": 12,
         * 	"prev": 8
         * }
         * }
         */
        server.get({ path: '/consumption', version: '1.0.0' }, controller.fetchConsumption);

        /**
         * @api {post} /:versionNumber/consumption Create
         * @apiName CreateNewHydration
         * @apiGroup Hydration
         * @apiDescription Post hydration for date specified, if entry already exists for a date, the post will delete that entry and overwrite with new one
         * @apiPermission Private
         * @apiVersion 1.0.0
         *
         * @apiUse VersionNumber
         * @apiParam {String} account Account association to post hydration
         * @apiParam {String} date Date of entry for hydration.
         * @apiParam {Integer} quantity Amount of liquids/hydration that was consumed, in ml.
         * @apiParam {String} unit Shows which format that user drank the liquid, possible units are (oz|cup|ml|liter) if not passed, defualts to oz.
         *
         */
        server.post({ path: '/consumption', version: '1.0.0' }, controller.createConsumption);

        /**
         * @api {put} /:versionNumber/consumption Update
         * @apiName UpdateNewHydration
         * @apiGroup Hydration
         * @apiDescription Update hydration for date specified, if no previous entry to update will assume previous entry is 0
         * @apiPermission Private
         * @apiVersion 1.0.0
         *
         * @apiUse VersionNumber
         * @apiParam {String} account Account association to post hydration
         * @apiParam {String} date Date of entry for hydration.
         * @apiParam {Integer} quantity Amount of liquids/hydration that was consumed.
         * @apiParam {String} unit Shows which format that user drank the liquid, possible units are (oz|cup|ml|liter) if not passed, defualts to oz.
         *
         */
        server.put({ path: '/consumption', version: '1.0.0' }, controller.updateConsumption);

        /**
         * @api {delete} /:versionNumber/hydration Delete
         * @apiName DeleteHydration
         * @apiGroup Hydration
         * @apiDescription Delete hydration entry for a specific date
         * @apiPermission Private
         * @apiVersion 1.0.0
         *
         * @apiUse VersionNumber
         * @apiParam {String} account Delete entry related to this account
         * @apiParam {String} date Date of entry for hydration.
         *
         */
        server.del({ path: '/consumption', version: '1.0.0' }, controller.deleteConsumption);
    }
};
