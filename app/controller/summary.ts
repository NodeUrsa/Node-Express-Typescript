import * as moment from 'moment';
import { RequestHandler } from 'restify';
import { model } from '../model/summary';
import { validation, validator } from '../validation/summary';

type SummaryController = {
    readonly fetchSummary: RequestHandler;
};

export const controller: SummaryController = {
    async fetchSummary(req, res, next) {
        try {
            if (typeof req.params.endDate !== 'string') {
                req.params.endDate = moment().format('YYYY-MM-DD');
            }
            const failureResponse = await validator.getSummary(req).then(validation.tryFail);
            if (failureResponse !== undefined) {
              res.send(failureResponse.code, failureResponse.body);
              return;
            }
            const summary = await model.fetch(req.params);
            res.send(200, summary);
        } catch (error) {
            req.log.error({ err: error, account: req.params.account }, `Failed to get summary`);
            res.send(500, { error: 'Failed to get summary' });
        } finally {
            next();
        }
    }
};
