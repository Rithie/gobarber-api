import { Router } from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

import authMiddleware from "./app/middlewars/auth";

const routes = new Router();

// routes.get("/", async (req, res) => {
//   const user = await User.create({
//     name: "Euler Alvarenga",
//     email: "euler@mail.com",
//     password_hash: "123456"
//   });
//   res.json(user);
// });

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.updated);

export default routes;
// yarn eslint --fix src --ext .js
