import dotenv from "dotenv";

const localEnv = dotenv.config({ path: ".env.local", override: true });

if (localEnv.error) {
  dotenv.config();
} else {
  dotenv.config({ override: false });
}
