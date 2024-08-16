import fetch from "node-fetch";
import { ConfigService } from "../../../../services/config.service";

/**
 * @swagger
 * /api/movies/{idMovie}/videos:
 *  get:
 *    description: Endpoint which returns movie videos
 *    parameters:
 *      - in: path
 *        name: idMovie
 *        required: true
 *        schema:
 *        type: string
 *        description: ID movie
 *    responses:
 *      200:
 *        description: Success Response
 */
export default async function handler(req, res) {
	const idMovie = parseInt(req.query.idMovie, 10);

	const url = ConfigService.themoviedb.urls.movieVideos(idMovie);
	// 'https://api.themoviedb.org/3/movie/{idMovie}/videos'
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + ConfigService.themoviedb.keys.API_TOKEN,
		},
	};

    const apiResponse = await fetch(url, options)
        .then(r => r.json())
        .catch(err => console.error('error:' + err));

    res.json({ status: 200, data: apiResponse.results });
	
}
