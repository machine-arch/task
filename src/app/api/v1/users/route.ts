import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function GET(req: Request) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: [1, 2, 3],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }
  const url = req.url;
  const parsedUrl = new URL(url);
  const queryParams = new URLSearchParams(parsedUrl.search);

  const queryParts: any[] = [];

  const parameters = ["name", "lastName", "agency", "role"];
  parameters.forEach((param) => {
    const value = queryParams.get(param);
    if (value) {
      queryParts.push(`${param}=${encodeURIComponent(value)}`);
    }
  });

  let usersUrl = "users";
  if (queryParts.length) {
    usersUrl += "?" + queryParts.join("&");
  }

  try {
    const users = await axiosInstance.get(usersUrl);
    const permissions = await axiosInstance.get("permissions");
    const roles = await axiosInstance.get("roles");
    if (!users.data) {
      return response("No users found", false, 404);
    }
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
    users.data.forEach((user: any) => {
      user.role = roles.data.find((role: any) => user.role == role.id);
    });
    return response("", true, 200, users.data);
  } catch (e: any) {
    console.log(e);
    return response(e.message, false, 500);
  }
}
