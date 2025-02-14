import clientPromise from "/lib/mongodb";

/**
 * @swagger
 * /api/movies/{idMovie}/likes:
 *  get:
 *    description: Endpoint which returns movie likes
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
 *      400:
 *        description: Error Response
 *  patch:
 *    description: Endpoint which increments movie likes
 *    parameters:
 *      - in: path
 *        name: idMovie
 *        required: true
 *        schema:
 *         type: string
 *        description: ID movie
 *    responses:
 *      201:
 *        description: Success Response
 *      400:
 *        description: Error Response 
 */
export default async function handler(req, res) {
  const idMovie = parseInt(req.query.idMovie, 10);

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {
    case "PATCH":
      const like = await db.collection("likes").findOne({ idTMDB: idMovie });
      let resMongo, data;

      if (like) {
        resMongo = await db
          .collection("likes")
          .updateOne({ idTMDB: idMovie }, { $inc: { likeCounter: 1 } });
        data = {
          action: "likeCounter incremented",
          idMovie: idMovie,
          matchedCount: resMongo.matchedCount,
          modifiedCount: resMongo.modifiedCount,
        };
        res.status(201).json({ status: 201, data: data });
      } else {
        resMongo = await db
          .collection("likes")
          .insertOne({ idTMDB: idMovie, likeCounter: 0 });
        data = {
          action: "likeCounter created",
          idMovie: idMovie,
          insertedId: resMongo.insertedId,
        };
        res.status(201).json({ status: 201, data: data });
      }

      break;

    case "GET":
      const likes = await db.collection("likes").findOne({ idTMDB: idMovie });
      res.json({ status: 200, data: { likes: likes } });
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}
