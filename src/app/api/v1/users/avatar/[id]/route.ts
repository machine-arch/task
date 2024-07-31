import { axiosInstance } from "../../../../../../config/axios.config";
import authenticationHelper from "@/helper/authentication.helper";
import { response, formDataToJson } from "@/util/response.util";
import path from "path";
import { writeFile } from "fs/promises";
export async function PUT(req: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(
    req,
    {
      module: "users",
      permission: 3,
    },
    true
  );
  if (!Auth.success) {
    return response(Auth.message as string, Auth.success, Auth.status);
  }

  const requestData = await req.formData();
  const file: any = requestData.get("file");
  const userId = params.id;
  const userData: any = await axiosInstance.get(`users?id=${userId}`);
  const user = userData.data[0];

  if (!user) {
    return response("User not found", false, 404);
  }

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer: any = Buffer.from(arrayBuffer);
    const filename = file.name.replaceAll(" ", "_");
    const uploadDir = path.resolve("./public/uploads/");
    const fullPath = path.join(uploadDir, filename);

    try {
      await writeFile(fullPath, buffer);
      user.file = fullPath;
    } catch (error) {
      console.error("Error writing file", error);
      return response("Error writing file", false, 500);
    }
  }

  try {
    console.log("user", userId);
    const res = await axiosInstance.put(`users/${userId}`, user);
    return response("", true, 200, res.data);
  } catch (e: any) {
    return response(e.message, false, 500);
  }
}
