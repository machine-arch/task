import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../config/axios.config";

export async function POST(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "tabs",
    permission: [1, 2],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  function generateRandomString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const newTab = await req.json();
  newTab.createdAt = new Date().toISOString();
  newTab.updatedAt = new Date().toISOString();
  newTab.name_code = generateRandomString(10).toUpperCase();

  try {
    const resData = await axiosInstance.post("tabs", newTab);
    return response("Role added successfully", true, 200, resData.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
