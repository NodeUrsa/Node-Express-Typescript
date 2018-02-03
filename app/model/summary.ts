import { SQL } from 'sql-template-strings';
import { db } from '../db';

interface Summary {
    date: string;
    total: number;
    max: number;
    average: number;
}

interface ParameterType {
    account: string;
    startDate: Date;
    endDate: Date;
    unit: string;
}

export const model = {
    async fetch(parameters: ParameterType): Promise<Summary[]> {
        const statement = SQL`
        WITH duration_amount AS (
            SELECT SUM(quantity) as total, MAX(quantity) as max, date_trunc(${parameters.unit}, date)::date AS date_group ,ROUND(SUM(quantity) / DATE_PART(\'days\', DATE_TRUNC(\'month\', date_trunc(${parameters.unit}, date)::date) + ${parameters.unit + 1}::INTERVAL - \'1 DAY\'::INTERVAL)) as average
            FROM consumption
            WHERE account = ${parameters.account}
            GROUP BY date_group
        )
        SELECT DISTINCT date_group, COALESCE(total, 0)::int as "total", COALESCE(max, 0)::int as "max", COALESCE(average, 0)::int as "average"
        FROM (
            SELECT generate_series(date_trunc(${parameters.unit}, ${parameters.startDate}::date), ${parameters.endDate}::date, ${parameters.unit + 1}) AS date_group
        ) x
        LEFT JOIN duration_amount
        USING (date_group)
        ORDER BY date_group DESC`;
        const { rows } = await db.query(statement);
        return rows.map((r: any) => ({
            date: r.date,
            total: r.total,
            max: r.max,
            average: r.average
        }) as Summary);
    }
};
