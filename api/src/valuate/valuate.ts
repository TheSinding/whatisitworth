import {
	FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions,
} from 'fastify';
import { DBAAPI } from '../apis/dba';
import { logger } from '../logger';
import { InterquartileRange } from '../utils';
import { Query, Schemas } from './schemas';

export interface Estimation {
	min: number,
	max: number,
	mean: number,
	estimation: number

}

const findMean = (set: number[]) => set.reduce((c, n) => n + c, 0) / set.length;
const findMax = (set: number[]) => set.reduce((c, n) => Math.max(n, c), -Infinity);
const findMin = (set: number[]) => set.reduce((c, n) => Math.min(n, c), Infinity);

export const ROUTE_OPTIONS: RouteShorthandOptions = {
	schema: {
		querystring: Schemas.Query,
		response: { 200: Schemas.Response },
	},
};
export type FRequest = FastifyRequest<{
	Querystring: Query
}>

export const route = async (fastify: FastifyInstance): Promise<void> => {
	DBAAPI.init();
	fastify.get('/valuate', async (request: FRequest, reply: FastifyReply) => {
		const listings = await DBAAPI.instance.search(request.query.search);
		logger.info('Getting value');

		const dataset = listings.filter(({ price }) => !Number.isNaN(price));
		const [rangeMin, rangeMax] = InterquartileRange(dataset
			.map(({ price }) => price));

		const filteredListings = dataset.filter(({ price }) => price >= rangeMin && price <= rangeMax);
		const onlyPrice = filteredListings.map(({ price }) => price);
		const mean = Number(findMean(onlyPrice).toFixed(2));

		const est: Estimation = {
			min: findMin(onlyPrice),
			max: findMax(onlyPrice),
			mean,
			estimation: Number((mean - (mean * 0.05)).toFixed(2)),
		};

		reply.send({ count: listings.length, estimation: est, data: listings });
	});
};
