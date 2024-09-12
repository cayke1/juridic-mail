import jwt from "jsonwebtoken";
import { env } from "./env";

export function GetIdByToken(authHeader: string) {
  const [, token] = authHeader.split(" ");
  const decodedInfo = jwt.verify(
    token,
    env.JWT_SECRET,
    function (err: any, decoded: any) {
      if (err) {
        throw err;
      }

      return decoded;
    }
  ) as any;

  const { id } = decodedInfo;
  return id;
}
