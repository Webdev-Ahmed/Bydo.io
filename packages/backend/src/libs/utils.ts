import { password as bcrypt } from "bun";

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, "bcrypt");
  return hashed;
};

export const comparePassword = async (password: string, hash: string) => {
  const verified = await bcrypt.verify(password, hash, "bcrypt");
  return verified;
};
