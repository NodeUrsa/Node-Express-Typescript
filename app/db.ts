import { Pool } from 'pg';
import { config } from '../config';

const props = ['address', 'db', 'user', 'pass'];
for (const prop of props) {
    if ((config.psql as any)[prop] === undefined) {
        throw new Error(`Property ${prop} is undefined in PSQL configuration.`);
    }
}

export const db = new Pool({
    host: config.psql.address,
    database: config.psql.db,
    user: config.psql.user,
    password: config.psql.pass,
    ssl: (typeof (config.psql.ssl as any) === 'boolean') ? config.psql.ssl : false
});
