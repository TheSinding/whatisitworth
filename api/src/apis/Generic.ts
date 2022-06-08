/* eslint-disable no-unused-vars */
import { AxiosInstance } from 'axios';

export abstract class GenericAPI {
	client: AxiosInstance;

	constructor(client: AxiosInstance) {
		this.client = client;
	}

	abstract search(term: string, options?: any): Promise<any>
}
