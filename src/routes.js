import { Router } from "express";
import multer from "multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";

// multer
import multerConfig from "./config/multer";

import authMiddleware from "./app/middlewars/auth";
import ProviderController from "./app/controllers/ProviderController";

const routes = new Router();

const upload = multer(multerConfig);

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

routes.post("/files", upload.single("file"), FileController.store);
routes.get("/providers", ProviderController.index);

export default routes;
// yarn eslint --fix src --ext .js
