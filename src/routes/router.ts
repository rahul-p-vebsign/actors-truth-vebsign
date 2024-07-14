import { Router } from "express";

import userRouter from "./user.routes";

const router = Router({ mergeParams: true });

router.use("/users", userRouter);

export default router;
