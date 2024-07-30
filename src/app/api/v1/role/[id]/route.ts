import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
import { axiosInstance } from "../../../../../config/axios.config";

export async function GET(req: Request, { params }: any) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: [1, 2, 3, 4],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  const { id } = params;

  try {
    const role = await axiosInstance.get(`roles?id=${id}`);
    if (!role.data) {
      return response("No role found", false, 404);
    }
    const permissions = await axiosInstance.get("permissions");
    role.data.forEach((role: any) => {
      role.permissions.users = permissions.data.users.filter(
        (permission: any) => role.permissions.users.includes(permission.id)
      );
    });
    role.data.forEach((role: any) => {
      role.permissions.tabs = permissions.data.tabs.filter((permission: any) =>
        role.permissions.tabs.includes(permission.id)
      );
    });
    return response("", true, 200, role.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
