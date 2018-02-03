import { SQL } from 'sql-template-strings';
import { db } from '../db';

export const model = {
    async check() {
        await db.query(SQL`
            SELECT COUNT(*) FROM consumption LIMIT 1
        `);
    }
};
