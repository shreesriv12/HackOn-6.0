import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

function hasCloudinaryConfig() {
  return env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret;
}

export async function uploadProfilePhoto(file) {
  if (!file) {
    return "";
  }

  if (!hasCloudinaryConfig()) {
    return `local-preview://${file.originalname}`;
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "products-without-second-chance/profiles",
    resource_type: "image",
  });

  return result.secure_url;
}
