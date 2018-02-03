import { domain, frisby } from './config';
import { resetDbSync } from './integration-suite';

const account = '200';
const date = '2016-06-02';

describe('Add Consumption', () => {
    beforeAll(done => {
        resetDbSync();
        done();
    });

    it('Add Consumption - account missing', done => {
        frisby
            .post(domain + '/1.0/consumption')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message : 'Account missing',
                path: 'account'
            })
            .done(done);
    });

    it('Add consumption - date missing', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account : account
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message : 'Date is missing',
                path: 'date'
            })
            .done(done);
    });

    it('Add consumption - date invalid', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account : account,
                date 	: '06-06-2016'
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Date format is invalid: 06-06-2016',
                path: 'date'
            })
            .done(done);
    });

    it('Add consumption - quantity missing', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account : account,
                date 	: date
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Quantity is missing',
                path: 'quantity'
            })
            .done(done);
    });

    it('Add consumption - quantity invalid', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 'x'
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Quantity must be a number: x',
                path: 'quantity'
            })
            .done(done);
    });

    it('Add consumption - unit missing', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 16
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Unit is missing',
                path: 'unit'
            })
            .done(done);
    });

    it('Add consumption - incorrect unit', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 16,
                unit 		: 'ounce'
            })
            .expect('status', 200)
            .expect('json', 'errors.?', {
                message	: 'Unit type not allowed: ounce',
                path: 'unit'
            })
            .done(done);
    });

    it('Add consumption', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account 	: 990,
                date 		: date,
                quantity 	: 162,
                unit 		: 'ml'
            })
            .expect('status', 200)
            .after(() => {
                it('Fetch newly created consumption', after => {
                    frisby
                        .get(domain + '/1.0/consumption?account=' + 990 + '&startDate=' + date)
                        .expect('status', 200)
                        .expect('json', {
                            hydration : {
                                '2016-06-02' : {
                                    quantity : 162
                                }
                            }
                        })
                        .done(after);
                });
            })
            .done(done);
    });

    it('Add consumption', done => {
        frisby
            .post(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 16,
                unit 		: 'ml'
            })
            .expect('status', 200)
            .after(() => {
                it('Fetch newly created consumption', after => {
                    frisby
                        .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + date)
                        .expect('status', 200)
                        .expect('json', {
                            hydration : {
                                '2016-06-02' : {
                                    quantity : 16
                                }
                            }
                        })
                        .done(after);
                });
            })
            .done(done);
    });
});

describe('Get consumption', () => {
    beforeAll(done => {
        resetDbSync();
        done();
    });

    it('Get consumption - account missing', done => {
        frisby
        .get(domain + '/1.0/consumption')
        .expect('status', 400)
        .expect('json', 'errors.?', {
            message	: 'Account is missing',
            path: 'account'
        })
        .done(done);
    });

    it('Get consumption - start date invalid', done => {
        frisby
            .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + '06-06-2016')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'startDate is invalid: 06-06-2016',
                path: 'startDate'
            })
            .done(done);
    });

    it('Get consumption - end date invalid', done => {
        frisby
        .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + date + '&endDate=' + '06-07-2017')
        .expect('status', 400)
        .expect('json', 'errors.?', {
            message	: 'endDate is invalid: 06-07-2017',
            path: 'endDate'
        })
        .done(done);
    });

    it('Get consumption in reverse chronological order', done => {
        frisby
            .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + date + '&order=dateDesc')
            .expect('status', 200)
            .done(done);
    });

    it('Get consumption', done => {
        frisby
            .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + date)
            .expect('status', 200)
            .expect('json', {
                hydration : {
                    '2016-06-02' : {
                        quantity : 16
                    }
                }
            })
            .done(done);
    });
});

describe('Update consumption', () => {
    beforeAll(done => {
        resetDbSync();
        done();
    });

    it('Update consumption - account missing', done => {
        frisby
            .put(domain + '/1.0/consumption')
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Account is missing',
                path: 'account'
            })
            .done(done);
    });

    it('Update consumption - date missing', done => {
        frisby
            .put(domain + '/1.0/consumption' , {
                account : account
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Date is missing',
                path: 'date'
            })
            .done(done);
    });

    it('Update consumption - date invalid', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account : account,
                date 	: '09-09-2016'
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Date format is invalid: 09-09-2016',
                path: 'date'
            })
            .done(done);
    });

    it('Update consumption - quantity missing', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account : account,
                date 	: date
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Quantity is missing',
                path: 'quantity'
            })
            .done(done);
    });

    it('Update consumption - quantity invalid', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 'v'
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Quantity must be a number: v',
                path: 'quantity'
            })
            .done(done);
    });

    it('Update consumption - unit missing', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 20
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Unit is missing',
                path: 'unit'
            })
            .done(done);
    });

    it('Update consumption - unit type incorrect', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 20,
                unit 		: 'xyz'
            })
            .expect('status', 400)
            .expect('json', 'errors.?', {
                message	: 'Unit type not allowed: xyz',
                path: 'unit'
            })
            .done(done);
    });

    it('Update consumption should be a new put', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account 	: 999,
                date 		: date,
                quantity 	: 20,
                unit 		: 'ml'
            })
            .expect('status', 200)
            .after(() => {
                it('Fetch newly created consumption via PUT', after => {
                    frisby
                        .get(domain + '/1.0/consumption?account=' + 999 + '&startDate=' + date)
                        .expect('status', 200)
                        .expect('json', {
                            hydration : {
                                '2016-06-02' : {
                                    quantity : 20
                                }
                            }
                        })
                        .done(after);
                });
            })
            .done(done);
    });

    it('Update consumption', done => {
        frisby
            .put(domain + '/1.0/consumption', {
                account 	: account,
                date 		: date,
                quantity 	: 20,
                unit 		: 'ml'
            })
            .expect('status', 200)
            .after(() => {
                it('Fetch newly created consumption', after => {
                    frisby
                        .get(domain + '/1.0/consumption?account=' + account + '&startDate=' + date)
                        .expect('status', 200)
                        .expect('json', {
                            hydration : {
                                '2016-06-02' : {
                                    quantity : 36
                                }
                            }
                        })
                        .done(after);
                });
            })
            .done(done);
    });
});

describe('Delete consumption', () => {
    beforeAll(done => {
        resetDbSync();
        done();
    });

    it('Delete consumption - not found', done => {
        frisby
            .delete(domain + '/1.0/consumption?date=2016-12-01&account=32423')
            .expect('status', 404)
            .expect('json', 'errors.?', {
                message 	: 'Failed to delete consumption'
            })
            .done(done);
    });

    it('Delete consumption - date is missing', done => {
        frisby
            .delete(domain + '/1.0/consumption?account=32423')
            .expect('status', 404)
            .expect('json', 'errors.?', {
                message 	: 'Date is missing',
                path		: 'date'
            })
            .done(done);
    });

    it('Delete consumption - date invalid', done => {
        frisby
            .delete(domain + '/1.0/consumption?date=20-12-1928&account=32423')
            .expect('status', 404)
            .expect('json', 'errors.?', {
                message 	: 'Date format is invalid: 20-12-1928',
                path		: 'date'
            })
            .done(done);
    });

    it('Delete consumption - account missing', done => {
        frisby
            .delete(domain + '/1.0/consumption', {
                date : date
            })
            .expect('status', 404)
            .expect('json', 'errors.?', {
                message 	: 'Account is missing',
                path		: 'account'
            })
            .done(done);
    });

    it('Delete consumption - account is not a number', done => {
        frisby
            .delete(domain + '/1.0/consumption?account=abc', {
                date : date
            })
            .expect('status', 404)
            .expect('json', 'errors.?', {
                message 	: 'Account is not a number: abc',
                path		: 'account'
            })
            .done(done);
    });

    it('Delete consumption', done => {
        frisby
            .delete(domain + '/1.0/consumption?date=' + date + '&account=' + account)
            .expect('status', 200)
            .done(done);
    });

    it('Delete consumption', done => {
        frisby
            .delete(domain + '/1.0/consumption?date=' + date + '&account=' + 999)
            .expect('status', 200)
            .done(done);
    });
});
