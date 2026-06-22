import app from "@/app";
import env from "@/libs/env";

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 The server is running on http://localhost:${PORT}`);
});
