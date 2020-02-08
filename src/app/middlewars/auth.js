import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // se não tiver token, retorne erro 404
  if (!authHeader) {
    return res.status(401).json({ error: "token not provided" });
  }
  // ['Bearer','token']
  const [, token] = authHeader.split(" ");

  try {
    // como jwt.verify n implementa async await, utilizamos promisify
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id; // inclui o idUSER na requisicao

    return next();
  } catch (err) {
    return res.status(401).json({ error: "token invalid" });
  }
};
