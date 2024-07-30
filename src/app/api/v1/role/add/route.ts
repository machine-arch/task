import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../config/axios.config";

export async function POST(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: 1,
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  const newRole = await req.json();
  newRole.createdAt = new Date().toISOString();
  newRole.updatedAt = new Date().toISOString();

  try {
    const resData = await axiosInstance.post("roles", newRole);
    return response("Role added successfully", true, 200, resData.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
