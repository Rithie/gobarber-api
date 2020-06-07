import { Router } from "express";
import multer from "multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FinishSignupController from "./app/controllers/FinishSignupController";

import ForgotPasswordController from "./app/controllers/Auth/ForgotPasswordController";
import ResetTokenController from "./app/controllers/Auth/ResetTokenController";

import FileController from "./app/controllers/FileController";
import ScheduleController from "./app/controllers/ScheduleController";

// multer
import multerConfig from "./config/multer";

import authMiddleware from "./app/middlewars/auth";
import ProviderController from "./app/controllers/ProviderController";
import AppointmentController from "./app/controllers/AppointmentController";
import NotificationController from "./app/controllers/NotificationController";
import AvailableController from "./app/controllers/AvailableController";
import ResetByEmailCodeController from "./app/controllers/Auth/ResetByEmailCodeController";
import CheckEmailCodeController from "./app/controllers/Auth/CheckEmailCodeController";
import FormSurveyController from "./app/controllers/FormSurveyController";
import LoadResourcesController from "./app/controllers/Auth/LoadResourcesController";

const routes = new Router();

const upload = multer(multerConfig);

routes.get("/ping", async (req, res) => {
  // const user = await User.create({
  //   name: "Euler Alvarenga",
  //   email: "euler@mail.com",
  //   password_hash: "123456"
  // });
  res.json({ status: "ping ok" });
});

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.post("/forgot", ForgotPasswordController.index);
routes.get("/reset/:token", ResetTokenController.index);
routes.post("/resetcode/:token", ResetByEmailCodeController.index);
routes.get("/checkcode/:token", CheckEmailCodeController.index);

routes.use(authMiddleware);

routes.put("/users", UserController.updated);
routes.put("/completeSignup", FinishSignupController.update);
routes.get("/myresources", LoadResourcesController.index);

routes.post("/files", upload.single("file"), FileController.store);
routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

routes.post("/appointments", AppointmentController.store);
routes.get("/appointments", AppointmentController.index);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedule", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

routes.get("/survey", FormSurveyController.index);

export default routes;
// yarn eslint --fix src --ext .js
