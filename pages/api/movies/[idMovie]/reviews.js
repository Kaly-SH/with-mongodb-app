import { ConfigService } from "../../../../services/config.service";
import clientPromise from "/lib/mongodb";

/**
 * @swagger
 * /api/movies/{idMovie}/reviews:
 *  post:
 *    description: Rate a movie and save it to your rated list.
 *    parameters:
 *      - in: path
 *        name: idMovie
 *        required: true
 *        schema:
 *          type: string
 *        description: ID movie
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 * 
 *    responses:
 *      200:
 *        description: Success Response
 *      400:
 *        description: Error Response
 *  delete:
 *    description: Delete a rate of a movie.
 *    parameters:
 *      - in: path
 *        name: idMovie
 *        required: true
 *        schema:
 *          type: string
 *        description: ID movie
 *    responses:
 *      201:
 *        description: Success Response
 *      400:
 *        description: Error Response 
 */
export default async function handler(req, res) {
  const idMovie = req.query.idMovie;

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {
    case "POST":

      const postOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
          Authorization: ConfigService.themoviedb.keys.API_AUTH,
        },
        body: JSON.stringify({ value: req.body.value }),
      };

      try {
        const response = await fetch(ConfigService.themoviedb.urls.rating(idMovie), postOptions);
        const movie = await response.json();
        if (response.ok) {
          res.status(200).json({ status: 200, data: { movie } });
        } else {
          res.status(400).json({ status: 400, error: movie });
        }
      } catch (err) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
      }
      break;

    case "DELETE":
      const deleteOptions = {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
          Authorization: ConfigService.themoviedb.keys.API_AUTH,
        },
      };

      try {
        const response = await fetch(ConfigService.themoviedb.urls.rating(idMovie), deleteOptions);
        if (response.ok) {
          res.status(200).json({ status: 200, message: "Rating deleted successfully" });
        } else {
          res.status(400).json({ status: 400, error: "Failed to delete rating" });
        }
      } catch (err) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
      }
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}
