import crypto from "crypto";
import TinyLink from "../models/tinylink.models.js";

export async function generateUniqueCode(length = 6) {
  let code;
  let exists = true;
  while (exists) {
    // Generates random alphanumeric string
    code = crypto.randomBytes(length)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, length);

    exists = await TinyLink.exists({ ShortCode: code });
  }

  return code;
}
