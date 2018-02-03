import { execSync } from 'child_process';
import { synchronousMigration } from 'selvera-migrations';
import { config } from '../config';

const migrationsRedirect = ['ignore' /*stdin*/, 'ignore' /* stdout */, process.stderr];
const schemaDrop = `psql -U postgres -h ${config.psql.address} -p 5432 -d ${config.psql.db} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${config.psql.user};'`;
const migration = synchronousMigration(config.psql, { stdio: migrationsRedirect });

export function resetDbSync() {
    execSync(schemaDrop, { stdio: migrationsRedirect });
    migration.execute();
}
