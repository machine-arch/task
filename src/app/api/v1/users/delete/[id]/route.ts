import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../../config/axios.config";

export async function DELETE(request: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(request, {
    module: "users",
    permission: 2,
  });
  console.log(Auth.success, "Auth");
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  try {
    const id = params.id;
    if (!id) {
      return response("No user found", false, 404);
    }
    const res = await axiosInstance.delete(`users/${id}`);
    return response("", true, 200, res.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
