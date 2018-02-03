export type Url = string;
export interface Psql {
    address: Url;
    db: string;
    user: string;
    pass: string;
    ssl: boolean;
}

export interface Metrics {
    licenseKey: string;
    env?: 'dev' | 'prod';
}

export interface Config {
    authHeader: string;
    deployLocation?: string;
    minLogLevel: number;
    ownerUser: string;
    ownerGroup: string;
    env: string;
    url: string;
    host: string;
    port: number;
    psql: Psql;
    metrics?: Metrics;
}
