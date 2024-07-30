import { axiosInstance } from "../../../../config/axios.config";
import { verifyPassword, generateToken } from "@/util/crypto.util";
import { response } from "@/util/response.util";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const user = await axiosInstance.get(`users?email=${username}`);
    const match = await verifyPassword(password, user.data[0].password);
    if (!match) {
      const token = generateToken(user.data[0]);
      const permissions = await axiosInstance.get("permissions");
      const roles = await axiosInstance.get("roles");
      roles.data.forEach((role: any) => {
        role.permissions.users = permissions?.data.users.filter(
          (permission: any) => role?.permissions?.users?.includes(permission.id)
        );
      });
      roles.data.forEach((role: any) => {
        role.permissions.tabs = permissions?.data?.tabs?.filter(
          (permission: any) => role?.permissions?.tabs?.includes(permission.id)
        );
      });
      roles.data.forEach((role: any) => {
        role.permissions.roles = permissions.data.roles.filter(
          (permission: any) => role?.permissions?.roles?.includes(permission.id)
        );
      });
      user.data.forEach((user: any) => {
        user.role = roles?.data?.find((role: any) => user?.role == role.id);
      });
      delete user.data[0].password;
      return response("", true, 200, { token, user: user.data[0] });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "password is not correct" }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
