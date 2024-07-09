import { Request, Response } from "express";

export function welcome(_req: Request, res: Response): Response {
  return res.json({ message: "Welcome to bezkoder application." });
}
