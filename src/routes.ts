import { Router } from "express";
import enshureAuthenticated from "./middlewares/EnshureAuthenticated";
import { authRoutes } from "./routes/AuthRoutes";
import { documentRoutes } from "./routes/DocumentRoutes";

const routes = Router();

routes.use(authRoutes);
routes.use("/documents", documentRoutes);
routes.use(enshureAuthenticated);


export { routes };
