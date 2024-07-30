import { axiosInstance } from "../../../../../config/axios.config";
import { transporter } from "../../../../../config/mail.config";
import { generateRandomPassword, hashPassword } from "@/util/crypto.util";
import authenticationHelper from "@/helper/authentication.helper";
import { response, formDataToJson } from "@/util/response.util";
import path from "path";
import { writeFile } from "fs/promises";
export async function POST(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: 1,
  });
  if (!Auth.success) {
    return response(Auth.message as string, Auth.success, Auth.status);
  }

  const password = generateRandomPassword();
  const newUser = await req.formData();
  const file: any = newUser.get("file");

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name.replaceAll(" ", "_");

    const uploadDir = path.resolve("./public/uploads/");
    const fullPath = path.join(uploadDir, filename);

    try {
      await writeFile(fullPath, buffer);
      newUser.set("file", fullPath);
    } catch (error) {
      console.error("Error writing file", error);
      return response("Error writing file", false, 500);
    }
  }

  const json: Record<string, string | string[]> = formDataToJson(newUser);
  json.password = await hashPassword(password);
  json.createdAt = new Date().toISOString();
  json.updatedAt = new Date().toISOString();

  try {
    const res = await axiosInstance.post("users", json);

    transporter.sendMail({
      from: "merabkhatiashvili@gmail.com",
      to: "merabkhatiashvili@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: `<b>password:   ${password}</b>`,
    });
    return response("", true, 200, res.data);
  } catch (e: any) {
    return response(e.message, false, 500);
  }
}
