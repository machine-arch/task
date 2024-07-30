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
    const user = await axiosInstance.get(`users?id=${id}`);
    if (!user.data) {
      return response("No role found", false, 404);
    }
    const permissions = await axiosInstance.get("permissions");
    const roles = await axiosInstance.get("roles");

    roles.data.forEach((role: any) => {
      role.permissions.users = permissions.data.users.filter(
        (permission: any) => role?.permissions?.users?.includes(permission.id)
      );
    });
    roles.data.forEach((role: any) => {
      role.permissions.tabs = permissions.data.tabs.filter((permission: any) =>
        role?.permissions?.tabs?.includes(permission.id)
      );
    });
    roles.data.forEach((role: any) => {
      role.permissions.roles = permissions.data.roles.filter(
        (permission: any) => role?.permissions?.roles?.includes(permission.id)
      );
    });
    user.data.forEach((user: any) => {
      user.role = roles.data.find((role: any) => user.role == role.id);
    });

    return response("", true, 200, user.data);
  } catch (e: any) {
    return response(e.message, false, 500, null);
  }
}
