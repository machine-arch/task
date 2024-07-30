import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../config/axios.config";

export async function GET(req: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "tabs",
    permission: [1, 2, 3, 4],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  const { id } = params;

  try {
    const tab = await axiosInstance.get(`tabs?id=${id}`);
    if (!tab.data) {
      return response("No role found", false, 404);
    }

    return response("", true, 200, tab.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
