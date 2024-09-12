import { Router } from "express";
import enshureAuthenticated from "./middlewares/EnshureAuthenticated";
import { authRoutes } from "./routes/AuthRoutes";

const routes = Router();

routes.use(authRoutes);
routes.use(enshureAuthenticated);


export { routes };
