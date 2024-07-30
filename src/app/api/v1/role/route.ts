import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function GET(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "roles",
    permission: [1, 2, 3, 4],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  try {
    const roles = await axiosInstance.get("roles");

    if (!roles.data) {
      return response("No role found", false, 404);
    }
    const permissions = await axiosInstance.get("permissions");

    roles.data.forEach((role: any) => {
      role.permissions.users = permissions.data.users.filter(
        (permission: any) => role.permissions.users.includes(permission.id)
      );
    });
    roles.data.forEach((role: any) => {
      role.permissions.tabs = permissions.data.tabs.filter((permission: any) =>
        role.permissions.tabs.includes(permission.id)
      );
    });

    return response("", true, 200, roles.data);
  } catch (e: any) {
    console.log(e);
    return response(e.message, false, 500);
  }
}
