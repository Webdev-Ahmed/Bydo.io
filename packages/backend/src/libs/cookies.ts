import type { Response, Request } from "express";

interface SetCookieOptions {
  maxAge?: number;
}

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: SetCookieOptions,
) => {
  res.cookie(name, value, {
    ...baseCookieOptions,
    maxAge: options?.maxAge,
  });
};

export const getCookie = (req: Request, name: string): string | null => {
  return req.cookies?.[name] ?? null;
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    ...baseCookieOptions,
  });
};
