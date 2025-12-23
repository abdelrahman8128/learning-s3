"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: [".env.local", ".env"] });
const multer_1 = __importDefault(require("multer"));
const uploade_to_s3_1 = require("./service/s3/uploade to s3");
const delete_from_s3_1 = require("./service/s3/delete from s3");
const app = (0, express_1.default)();
const port = 3000;
const upload = (0, multer_1.default)({ dest: "uploads/" });
app.post("/upload", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ error: "لم يتم إرسال صورة" });
    try {
        const url = yield (0, uploade_to_s3_1.uploadToS3)(req.file.path, req.file.originalname, req.file.mimetype, req, res);
        res.json({ message: "تم رفع الصورة بنجاح!", url });
    }
    catch (err) {
        res.status(500).json({ error: "حصل خطأ في رفع الصورة", details: err });
    }
}));
// Delete from S3
app.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.query;
    if (!key)
        return res.status(400).json({ error: "لم يتم إرسال اسم الملف" });
    try {
        yield (0, delete_from_s3_1.deleteFromS3)(req, res);
        res.json({ message: "تم حذف الملف بنجاح!" });
    }
    catch (err) {
        res.status(500).json({ error: "حصل خطأ في حذف الملف", details: err });
    }
}));
// GET / => Hello
app.get("/", (req, res) => {
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
app.get("/hello", (req, res) => {
    const name = req.query.name || "Guest";
    res.json({ message: `Hello, ${name}!` });
});
app.listen(3000, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:3000`);
});
const app2 = (0, express_1.default)();
app2.get("/api/", (req, res) => {
    res.send("Hellooo from the second app on port 4000!");
});
app2.listen(4000, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:4000`);
});
