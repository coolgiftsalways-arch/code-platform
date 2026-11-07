import express from "express";

import {
  getProject,
  listCategories,
  verifyCertificate,
} from "../controllers/showcaseController.js";

const router = express.Router();

// GET /api/categories            categories with live numbers
router.get("/categories", listCategories);

// GET /api/projects/:id          one public project
router.get("/projects/:id", getProject);

// GET /api/certificates/:number  check a certificate, e.g. DVX-2EBEF1
router.get("/certificates/:number", verifyCertificate);

export default router;
