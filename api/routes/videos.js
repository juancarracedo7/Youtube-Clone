import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getByTags,
  getByTitle,
  getVideo,
  ramdon,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//**trends videos
router.get("/trend", trend); // van antes estas rutas que las del id

//**search by tags video
router.get("/tags", getByTags)

//**search by title video
router.get("/title", getByTitle)

//**ramdon videos
router.get("/ramdon", ramdon); // van antes estas rutas que las del id

//**subscriber videos
router.get("/sub", verifyToken, sub);// van antes estas rutas que las del id

//**create a video
router.post("/", verifyToken, addVideo);

//**update a video
router.put("/:id", verifyToken, updateVideo);

//**delete a video
router.delete("/:id", verifyToken, deleteVideo);

//**get a video
router.get("/:id", getVideo);

//**video views
router.put("/view/:id", addView);






export default router;
