import { domain, frisby } from './config';
import { resetDbSync } from './integration-suite';

describe('Summary V1', () => {
    beforeAll(done => {
        resetDbSync();
        done();
    });

    it('Should return error with 400 status', done => {
        frisby
            .get(domain + '/1.0/summary')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Account is missing',
                path : 'account'
            })
            .done(done);
    });

    it('Should return start date missing', done => {
        frisby
            .get(domain + '/1.0/summary?account=292')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'startDate is missing',
                path: 'startDate'
            })
            .done(done);
    });

    it('Should return invalid date', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-0-20')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'startDate format is invalid: 2000-0-20',
                path : 'startDate'
            })
            .done(done);
    });

    it('Should return end date invalid', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-01-01&endDate=2193-00-1')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'endtDate format is invalid: 2193-00-1',
                path : 'endDate'
            })
            .done(done);
    });

    it('Should return end date before start date', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-01-01&endDate=1999-01-01')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'End date must be after start date',
                path : 'reversed'
            })
            .done(done);
    });

    it('Get summary - unit missing', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-01-01&endDate=2001-01-01')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Unit is missing',
                path : 'unit'
            })
            .done(done);
    });

    it('Get summary - unit invalid', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-01-01&endDate=2001-01-01&unit=weekk')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Unit type not allowed: weekk',
                path : 'unit'
            })
            .done(done);
    });

    it('Get summary', done => {
        frisby
            .get(domain + '/1.0/summary?account=292&startDate=2000-01-01&endDate=2000-01-01&unit=week')
            .expect('status', 400)
            .expect('json', 'errors.?', '0', {
                date : '1999-12-27',
                total : 0,
                max : 0,
                average : 0
            })
            .done(done);
    });
});
