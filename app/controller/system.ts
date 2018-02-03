import { RequestHandler } from 'restify';
import { model } from '../model/system';

type SystemController = {
    readonly health: RequestHandler;
};

export const controller: SystemController = {
    async health(req, res, next) {
        try {
            await model.check();
            res.send(200);
        } catch (error) {
            req.log.fatal({ err: error }, 'Database is unreachable during health check');
            res.send(500, 'Database is unreachable during health check');
        } finally {
            next();
        }
    }
};
