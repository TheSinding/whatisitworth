import axios from "axios"

export interface Estimation {
	min: number,
	max: number,
	mean: number,
	estimation: number
}
interface Listing {
	price: number,
	preview: string,
	title: string
}

interface ValueResponse {
	count: number,
	estimation: Estimation,
	data: Listing[]
}
export const queryValue = async (searchTerm: string): Promise<Estimation> => {
	const response = await axios.get<ValueResponse>("http://localhost:3000/valuate", { params: { search: searchTerm } })
	return response.data.estimation
}