import fastify from 'fastify';
import { logger } from './logger';
import { route as valuateRoute } from './valuate/valuate';

const instance = fastify({ logger: true });

const config = {
	host: '0.0.0.0',
	port: 3000,
};
instance.register(valuateRoute);

const start = async () => {
	try {
		await instance.listen(config.port, config.host);
		logger.info(`Server is running on port ${config.port}`);
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
};
start();
