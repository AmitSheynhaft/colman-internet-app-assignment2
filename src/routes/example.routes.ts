import { Router, Request, Response } from "express";

const router = Router();

// GET /api/example
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Example route",
    data: {
      timestamp: new Date().toISOString(),
      description: "This is an example endpoint",
    },
  });
});

// POST /api/example
router.post("/", (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({
    message: "Data received",
    data: { name, timestamp: new Date().toISOString() },
  });
});

export default router;
