import * as moment from 'moment';
import { Request } from 'restify';
import { Error, validation } from 'selvera-validation';
export { validation };

/**
 * Summary validator
 */

const units = ['oz', 'ml', 'liter', 'cup'];
const unitSets = new Set(units);

export const validator = {
    async getSummary(req: Request) {
        const errors: Error[] = [];

        if (validation.isMissingOrEmpty(req.params.account)) {
            errors.push(validation.error('Account is missing', 'account'));
        } else if (validation.isBigint(req.params.account)) {
            errors.push(validation.error('Account is not a number: ' + req.params.account, 'account'));
        }

        if (validation.isMissingOrEmpty(req.params.startDate)) {
            errors.push(validation.error('startDate is missing', 'startDate'));
        } else if (!moment(req.params.startDate).isValid()) {
            errors.push(validation.error('startDate format is invalid: ' + req.params.date, 'startDate'));
        }

        if (validation.isMissingOrEmpty(req.params.endDate)) {
            errors.push(validation.error('endDate is missing', 'endDate'));
        } else if (!moment(req.params.endDate).isValid()) {
            errors.push(validation.error('endtDate format is invalid: ' + req.params.endDate, 'endDate'));
        }

        if (moment(req.params.startDate).isAfter(moment(req.params.endDate))) {
            errors.push(validation.error('End date must be after start date', 'reversed'));
        }

        if (validation.isMissingOrEmpty(req.params.unit)) {
            errors.push(validation.error('Unit is missing', 'unit'));
        } else if (!isNaN(req.params.unit)) {
            errors.push(validation.error('Unit is a string: ' + req.params.date, 'unit'));
        } else if (!unitSets.has(req.params.unit)) {
            errors.push(validation.error('Unit type not allowed: ' + req.params.unit, 'unit'));
        }

        return errors;
    }
};
