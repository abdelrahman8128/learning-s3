import express, { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import multer from "multer";
import { uploadToS3 } from "./service/s3/uploade to s3";
import { deleteFromS3 } from "./service/s3/delete from s3";

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "لم يتم إرسال صورة" });

    try {
      const url = await uploadToS3(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
        req,
        res
      );
      res.json({ message: "تم رفع الصورة بنجاح!", url });
    } catch (err) {
      res.status(500).json({ error: "حصل خطأ في رفع الصورة", details: err });
    }
  }
);

// Delete from S3

app.delete("/delete", async (req: Request, res: Response) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "لم يتم إرسال اسم الملف" });

  try {
    await deleteFromS3(req, res);
    res.json({ message: "تم حذف الملف بنجاح!" });
  } catch (err) {
    res.status(500).json({ error: "حصل خطأ في حذف الملف", details: err });
  }
});

// GET / => Hello
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Welcome</title>
      </head>
      <body>
        <h1>Hi, welcome to my PBE area </h1>
      </body>
    </html>
  `);
});

// مثال: GET /hello?name=Ali
app.get("/hello", (req: Request, res: Response) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}!` });
});

app.listen(3000, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:3000`);
});

const app2 = express();
app2.get("/api/", (req: Request, res: Response) => {
  res.send("Hellooo from the second app on port 4000!");
});
app2.listen(4000, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:4000`);
  console.log("Environment Variable TEST_ENV_VAR:";
  console.log(process.env.TEST_ENV_VAR);
});
