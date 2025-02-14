import fetch from "node-fetch";
import clientPromise from "/lib/mongodb";
import { ConfigService } from "/services/config.service";

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
*     description: Endpoint which returns movie data
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*     responses:
*       200:
*         description: Success Response
*       400:
*         description: Error Response
 */
export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);

  const url = ConfigService.themoviedb.urls.movie(idMovie);
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + ConfigService.themoviedb.keys.API_TOKEN
    }
  };

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {

    case "GET":
      const movie = await fetch(url, options)
      .then(r => r.json())
      .catch(err => console.error('error:' + err));

      const likes = await db.collection("likes").findOne({idTMDB: idMovie});

      if (likes.likeCounter) {
        movie.likes = likes.likeCounter;
      } else {
        movie.likes = 0;
      }

      if (movie) {
        res.json({ status: 200, data: { movie: movie } });
      } else {
        res.status(404).json({ status: 404, error: "Not Found" });
      }
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}