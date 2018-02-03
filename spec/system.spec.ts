import { domain, frisby } from './config';

describe('Status endpoint', () => {
    it('should return 200 when the service is accessible', done => {
        frisby
            .get(domain + '/1.0/system')
            .expect('status', 200)
            .done(done);
    });
});
