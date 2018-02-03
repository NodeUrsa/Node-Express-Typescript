/**
 * @apiDefine VersionNumber
 * @apiParam {Decimal} versionNumber The version number of this API to use, passed as the first URI parameter
 */

/**
 * @apiDefine Error
 * @apiError {String} message Human-readable error message, along with appropriate HTTP status code
 */

import * as bunyan from 'bunyan';
import * as restify from 'restify';
import { urlVersioning } from 'selvera-url-versioning';
import { config } from '../config';
import { db } from './db';
import { route as consumption } from './route/consumption';
import { route as summary } from './route/summary';
import { route as system } from './route/system';

/**
 * Log config
 */
const log = bunyan.createLogger({
    name: 			'hydration',
    serializers:	bunyan.stdSerializers,
    streams: [
        {
            level: 	config.minLogLevel,
            stream:	process.stdout
        }
    ]
});

/**
 * Create server
 */
const server = restify.createServer({
    name:		'hydration',
    version: 	'0.1.0',
    log: 		log
});

/**
 * Config
 */
server.pre(restify.plugins.pre.sanitizePath());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.requestLogger());
server.pre(urlVersioning());
server.use(restify.plugins.bodyParser({
    maxBodySize: 50000000,
    mapParams: true
}));

log.info({
    db: {
        host: config.psql.address,
        name: config.psql.db,
        user: config.psql.user,
        listenerCount: db.listenerCount
    }
}, 'Initiated DB connection');

/**
 * Pre-request handling
 */
server.use(function incomingRequestHandler(req, res, next) {
    const anyReq = req as any;
    req.log.info({
        url: req.url,
        type: 'incoming request',
        originalUrl: anyReq.originalUrl,
        version: {
            requested: req.version(),
            matched: typeof anyReq.matchedVersion === 'function' ? anyReq.matchedVersion() : undefined
        }
    });

    if ((req.headers.authorization as any) === undefined) {
        req.log.warn('Empty authorization header');
        res.send(401);
        next(false);
    } else if (req.headers.authorization !== config.authHeader) {
        req.log.warn({ authHeader: req.headers.authorization }, 'Invalid authorization header');
        res.send(403);
        next(false);
    } else {
        next();
    }
});

/**
 * Server config
 */
const auditLogger = restify.plugins.auditLogger({ log, event: 'after' });
server.on('after', auditLogger);

system.init(server);
consumption.init(server);
summary.init(server);

/**
 * Start server
 */
server.listen(config.port, () => {
    log.info({ server: { name: server.name, url: server.url } }, `Hydration service listening at ${server.url}`);
});
