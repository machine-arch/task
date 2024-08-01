import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function GET(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: [1, 2, 3],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  try {
    const permissions = await axiosInstance.get("permissions");
    if (!permissions.data) {
      return response("No permission found", false, 404);
    }
    return response("", true, 200, permissions.data);
  } catch (e: any) {
    console.log(e);
    return response(e.message, false, 500);
  }
}
