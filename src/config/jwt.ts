import { env } from "../utils/env";

export default {
    secret: env.JWT_SECRET,
    expiresIn: "1d"
}