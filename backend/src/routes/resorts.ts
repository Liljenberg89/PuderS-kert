import { Router } from "express";
import { resorts } from "../data/resorts";

const router = Router();

router.get("/", (_req, res) => {
  res.json(resorts);
});

export default router;
