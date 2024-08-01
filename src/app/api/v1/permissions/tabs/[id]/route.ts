import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../../config/axios.config";

export async function GET(request: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(request, {
    module: "users",
    permission: [1, 2, 3],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }
  const { id } = params;
  try {
    const permissions = await axiosInstance.get(`permissions`);
    const permission = permissions.data.tabs.filter((p: any) => p.id == id);
    if (!permission) {
      return response("No permission found", false, 404);
    }
    return response("", true, 200, permission);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
