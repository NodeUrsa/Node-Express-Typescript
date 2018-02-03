import { Page, paged, Paged, pagedSql } from 'selvera-pg';
import { SQL } from 'sql-template-strings';
import { db } from '../db';

export interface EntryType {
    account: string;
    date: Date;
    quantity: number;
}

export interface FetchType {
    account: string;
    startDate?: string;
    endDate?: string;
    order?: string;
    offset?: number;
}

export interface DeleteType {
    account: string;
    date: string;
}

export interface Hydration {
    [date: string]: {
        quantity: number;
    };
}

export const model = {
    async add(consumptionData: EntryType): Promise<void> {
        const statement = SQL`
        INSERT INTO consumption (
            account,
            date,
            quantity
        )
        VALUES (
            ${consumptionData.account},
            ${consumptionData.date},
            ${consumptionData.quantity}
        )`;
        await db.query(statement);
    },

    async delete(entryData: DeleteType): Promise<void> {
        await db.query(SQL`
        DELETE FROM consumption
        WHERE account = ${entryData.account}
        AND
        date = ${entryData.date}
        `);
    },

    async fetch(parameters: FetchType): Promise<Paged<Hydration>> {
        const orderClause: string = (parameters.order === 'dateDesc') ?
            ' ORDER BY date DESC ' : ' ORDER BY date ASC ';

        const query = SQL`
            SELECT to_char(date, 'YYYY-MM-DD') as date, json_agg(json_build_object('quantity', consumption.quantity)) AS hydration
            FROM consumption`;
            // Acount
        query.append(SQL` WHERE consumption.account = ${parameters.account}`);

        // Start Date
        if (typeof parameters.startDate !== 'undefined' && parameters.startDate !== '') {
            query.append(SQL` consumption.date >= ${parameters.startDate}`);
        }

        // End Date
        if (typeof parameters.endDate !== 'undefined' && parameters.endDate !== '') {
            query.append(SQL` consumption.date <= ${parameters.endDate}`);
        }

        query.append(SQL` GROUP BY date ${orderClause} LIMIT 26`);

        // Offset
        if (typeof parameters.offset !== 'undefined') {
            query.append(SQL` OFFSET ${parameters.offset}`);
        }

        const page = new Page(10, parameters.offset);
        const pagedQuery = pagedSql(query, page);

        const result = await db.query(pagedQuery);

        return paged(result.rows as Hydration[], page);
    },

    async update(consumptionData: EntryType): Promise<void> {
        const statement = SQL`
        UPDATE consumption
        SET
            quantity = ${consumptionData.quantity}
        WHERE
            account = ${consumptionData.account}
        AND
            date = ${consumptionData.date}
        `;
        await db.query(statement);
    },

    async upsert(consumptionData: EntryType) {
        await db.query(SQL`
        INSERT INTO consumption (
            account,
            date,
            quantity
        )
        VALUES (
            ${consumptionData.account},
            ${consumptionData.date},
            ${consumptionData.quantity}
        )
        ON CONFLICT (account, date)
        DO UPDATE
            SET
                quantity += EXCLUDED.quantity
        `);
    }
};
