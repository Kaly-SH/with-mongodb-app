
import fetch from "node-fetch";
import { ConfigService } from "./config.service";


export const fetchMovieDB = async (method, url, opt = undefined) => {
	const options = {
		method: method,
		headers: {
			'accept': 'application/json',
			'Authorization': ConfigService.themoviedb.keys.API_AUTH,
		},
		...opt
	}

	const response = await fetch(url, options)
		.then((res) => res.json())
		.catch((err) => {
			console.error('error:' + err);
			return null;
		});

	return response;
}