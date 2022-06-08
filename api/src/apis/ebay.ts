import axios, { AxiosInstance } from 'axios';

export class EbayAPI {
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: '',
		});
	}
}
