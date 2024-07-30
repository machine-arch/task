import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function GET(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, true);
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  try {
    const agency = await axiosInstance.get("agency");
    if (!agency.data) {
      return response("No agency found", false, 404);
    }
    return response("", true, 200, agency.data);
  } catch (e: any) {
    console.log(e);
    return response(e.message, false, 500);
  }
}
