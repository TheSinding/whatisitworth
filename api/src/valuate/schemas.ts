import { Static, Type } from '@sinclair/typebox';

export namespace Schemas {
	export const Response = Type.Object({
		count: Type.Number(),
		data: Type.Array(Type.Object({
			preview: Type.String(),
			title: Type.String(),
			value: Type.Number(),
		})),
	}, {
		$id: 'urn:danfoss:enspire:admintool:ecl-migration:url#response',
		additionalProperties: false,
	});
	export const Query = Type.Object({
		search: Type.String({ description: 'Search term' }),
	}, {
		$id: 'urn:whatisitworth:valuate#query',
		additionalProperties: false,
	});
}

export type Query = Static<typeof Schemas.Query>
export type Response = Static<typeof Schemas.Response>
