import app from "./app";
import { env } from "./utils/env";

const port = env.PORT || 3354;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
