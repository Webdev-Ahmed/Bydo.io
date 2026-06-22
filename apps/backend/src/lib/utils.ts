import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
};

export const comparePassword = async (password: string, hash: string) => {
  const verified = await bcrypt.compare(password, hash);
  return verified;
};
