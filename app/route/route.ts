import { Server } from 'restify';

export interface Route {
    init(server: Server): void;
}
