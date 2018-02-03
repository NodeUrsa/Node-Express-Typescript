import * as moment from 'moment';
import { Request } from 'restify';
import { Error, validation } from 'selvera-validation';
export { validation };

/**
 * Consumption validator
 */

const units = ['oz', 'ml', 'liter', 'cup'];
const unitSets = new Set(units);

export const validator = {
    async get(req: Request) {
        const errors: Error[] = [];
        if (validation.isMissingOrEmpty(req.params.account)) {
            errors.push(validation.error('Account is missing', 'account'));
        } else if (validation.isBigint(req.params.account)) {
            errors.push(validation.error('Account is not a number: ' + req.params.account, 'account'));
        }

        if (!moment(req.params.startDate).isValid()) {
            errors.push(validation.error('startDate is invalid: ' + req.params.startDate, 'startDate'));
        }

        if (!moment(req.params.endDate).isValid()) {
            errors.push(validation.error('endDate is invalid: ' + req.params.endDate, 'endDate'));
        }

        if (isNaN(req.params.offset)) {
            errors.push(validation.error('Offset is NaN: ' + req.params.offset, 'offset'));
        }

        return errors;
    },
    async upsert(req: Request) {
        const errors: Error[] = [];
        if (validation.isMissingOrEmpty(req.params.account)) {
            errors.push(validation.error('Account is missing', 'account'));
        } else if (validation.isBigint(req.params.account)) {
            errors.push(validation.error('Account is not a number: ' + req.params.account, 'account'));
        }

        if (validation.isMissingOrEmpty(req.params.date)) {
            errors.push(validation.error('Date is missing', 'date'));
        } else if (!moment(req.params.date).isValid()) {
            errors.push(validation.error('Date format is invalid: ' + req.params.date, 'date'));
        }

        if (validation.isMissingOrEmpty(req.params.quantity)) {
            errors.push(validation.error('Quantity is missing', 'quantity'));
        } else if (Number.isNaN(Number.parseInt(req.params.quantity))) {
            errors.push(validation.error('Quantity must be a number: ' + req.params.quantity, 'quantity'));
        }

        if (validation.isMissingOrEmpty(req.params.unit)) {
            errors.push(validation.error('Unit is missing', 'unit'));
        } else if (!isNaN(req.params.unit)) {
            errors.push(validation.error('Unit is a string: ' + req.params.date, 'unit'));
        } else if (!unitSets.has(req.params.unit)) {
            errors.push(validation.error('Unit type not allowed: ' + req.params.unit, 'unit'));
        }

        return errors;
    },

    async delete(req: Request) {
        const errors: Error[] = [];
        if (validation.isMissingOrEmpty(req.params.account)) {
            errors.push(validation.error('Account is missing', 'account'));
        } else if (validation.isBigint(req.params.account)) {
            errors.push(validation.error('Account is not a number: ' + req.params.account, 'account'));
        }

        if (validation.isMissingOrEmpty(req.params.date)) {
            errors.push(validation.error('Date is missing', 'date'));
        } else if (!moment(req.params.date).isValid()) {
            errors.push(validation.error('Date format is invalid: ' + req.params.date, 'date'));
        }

        return errors;
    }
};
