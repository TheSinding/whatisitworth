/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
import { ok } from 'assert';
import axios from 'axios';
import Crawler from 'crawler';
import { logger } from '../logger';
import { GenericAPI } from './Generic';

interface Listing {
	title: string,
	preview: string,
	price: number
}

export class DBAAPI extends GenericAPI {
	static _instance: DBAAPI;

	constructor() {
		const client = axios.create({
			baseURL: 'https://dba.dk',
		});
		super(client);
	}

	static init() {
		this._instance = new DBAAPI();
	}

	public static get instance(): DBAAPI {
		ok(this._instance, 'Static instance not initialized, call .init()');
		return this._instance;
	}

	async search(term: string): Promise<Listing[]> {
		const totalListings: Listing[] = [];
		const maxPageDepth = 5;
		let currentPageDepth = 0;
		return new Promise((resolve, reject) => {
			const crawler = new Crawler({
				maxConnections: 10,
				callback: (error, res, done) => {
					logger.info(`Crawling page ${currentPageDepth}`);
					if (error) {
						return reject(error);
					}
					const { $ } = res;
					const listings = $('.dbaListing');
					const nextPage = $('a[data-ga-lbl="paging-next"]');
					if (currentPageDepth < maxPageDepth) {
						const href = nextPage.attr('href');
						if (href) {
							logger.info(`Queing ${href}`);
							crawler.queue(`https://dba.dk${href}`);
						}
					}

					// eslint-disable-next-line func-names
					listings.each(function () {
						// @ts-ignore
						const preview = $(this).find('.expandable-box > a.listingLink').text();
						// @ts-ignore
						const title = $(this).find('.mainContent > a.listingLink').text();
						// @ts-ignore
						const price = $(this).find('td[title="Pris"]').text().trim()
							.replace('kr', '')
							.replace(/\.|\s/g, '');

						totalListings.push({
							title: title.trim(),
							preview: preview.trim(),
							price: Number(price),
						});
					});

					// eslint-disable-next-line no-plusplus
					currentPageDepth++;
					return done();
				},

			});
			logger.info('Crawling');
			crawler.queue(`https://dba.dk/soeg?soeg=${term}`);
			crawler.on('drain', () => {
				resolve(totalListings);
			});
		});

		// const response = await this.client.get<string>('/soeg', {

		// 	params: {
		// 		soeg: term,
		// 	},
		// });
		// console.log(response.data);

		// const dom = new JSDOM(response.data);
		// console.log(dom.window.document);
	}
}
