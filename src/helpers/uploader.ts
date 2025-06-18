import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<{
  result: UploadApiResponse | undefined;
  optimizeUrl: string | undefined;
}> => {
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: "dtqsckwk9",
      api_key: "461689883496168",
      api_secret: "znh0tDJh3qycZUBD2kAqf4ROsPM",
    });

    // Upload an image
    cloudinary.uploader.upload(
      file.path,
      {
        public_id: file.originalname,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          const optimizeUrl = cloudinary.url(file.originalname, {
            fetch_format: "auto",
            quality: "auto",
            crop: "auto",
            gravity: "auto",
            width: 500,
            height: 500,
          });
          fs.unlinkSync(file.path);
          resolve({ result, optimizeUrl });
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
