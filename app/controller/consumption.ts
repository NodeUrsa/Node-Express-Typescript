import * as moment from 'moment';
import { RequestHandler } from 'restify';
import { model as consumption } from '../model/consumption';
import { EntryType } from '../model/consumption';
import { convertUnits } from '../model/conversion';
import { ConvertTypeParams } from '../model/conversion';
import { Quantity } from '../model/conversion';
import { validation, validator } from '../validation/consumption';

type ConsumptionController = {
    readonly [Method in 'createConsumption' | 'deleteConsumption'
                        | 'fetchConsumption' | 'updateConsumption' ]: RequestHandler;
};

export const controller: ConsumptionController = {
    async createConsumption(req, res, next) {
        try {
            const failureResponse = await validator.upsert(req).then(validation.tryFail);
            if (failureResponse !== undefined) {
                res.send(failureResponse.code, failureResponse.body);
                return;
            }
            const consumptionQuantity: Quantity = convertUnits(req.params);
            const entryData: EntryType = {
                account: req.params.account,
                date: req.params.date,
                quantity: consumptionQuantity
            };
            await consumption.upsert(entryData);
            res.send(200);
        } catch (error) {
            req.log.error({ err: error, account: req.params.account }, `Failed to create consumption`);
            res.send(500, { error: 'Failed to create consumption' });
        } finally {
            next();
        }
    },

    async updateConsumption(req, res, next) {
        try {
            const failureResponse = await validator.upsert(req).then(validation.tryFail);
            if (failureResponse !== undefined) {
                res.send(failureResponse.code, failureResponse.body);
                return;
            }
            const conversionData: ConvertTypeParams = {
                quantity : req.params.quantity,
                unit	 : req.params.unit
            };

            const consumptionQuantity: Quantity = convertUnits(conversionData);
            const entryData: EntryType = {
                account: req.params.account,
                date: req.params.date,
                quantity: consumptionQuantity
            };
            await consumption.upsert(entryData);
        } catch (error) {
            req.log.error({ err: error, account: req.params.account }, `Failed to upsert consumption`);
            res.send(500, 'Failed to retrieve consumption.');
        } finally {
            next();
        }
    },

    async deleteConsumption(req, res, next) {
        try {
            const failureResponse = await validator.delete(req).then(validation.tryFail);
            if (failureResponse !== undefined) {
                res.send(failureResponse.code, failureResponse.body);
                return;
            }
            await consumption.delete(req.params);
            res.send(200);
        } catch (error) {
            req.log.error({ err: error, account: req.params.account }, `Failed to delete consumption`);
            res.send(500, { error: 'Failed to delete consumption' });
        } finally {
            next();
        }
    },

    async fetchConsumption(req, res, next) {
        try {
            if (req.params.endDate === undefined) {
                req.params.endDate = moment().format('MM-DD-YYYY');
            }
            const failureResponse = await validator.upsert(req).then(validation.tryFail);
            if (failureResponse !== undefined) {
                res.send(failureResponse.code, failureResponse.body);
                return;
            }
            const result = await consumption.fetch(req.params);
            res.send(200, result);
        } catch (error) {
            req.log.error({ err: error, account: req.params.account }, `Failed to fetch consumption`);
            res.send(500, { error: 'Failed to fetch consumption' });
        } finally {
            next();
        }
    }
};
