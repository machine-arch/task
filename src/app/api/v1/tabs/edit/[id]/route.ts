import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function PUT(request: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(request, {
    module: "tabs",
    permission: 3,
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  try {
    const tab = await request.json();
    tab.updatedAt = new Date().toISOString();
    const id = params.id;
    if (!id) {
      return response("No role found", false, 404);
    }

    const res = await axiosInstance.put(`tabs/${id}`, tab);

    return response("", true, 200, res.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
