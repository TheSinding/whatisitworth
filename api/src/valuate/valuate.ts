import {
	FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions,
} from 'fastify';
import { DBAAPI } from '../apis/dba';
import { logger } from '../logger';
import { Query, Schemas } from './schemas';

interface Estimation {
	min: number,
	max: number,
	mean: number,
	estimation: number

}

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
		const estimation: Estimation = {
			min: Infinity,
			max: -Infinity,
			mean: 0,
			estimation: 0,
		};

		const newEst = listings.reduce((prev, { price }, i, a) => {
			const mean = prev.mean + price;
			return {
				...prev,
				mean: i === a.length - 1 ? mean / a.length : mean,
				min: price > prev.min ? prev.min : price,
				max: price < prev.max ? prev.max : price,
			};
		}, estimation);

		reply.send({ count: listings.length, estimation: newEst, data: listings });
	});
};
