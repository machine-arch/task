import { axiosInstance } from "../../../../../config/axios.config";
import { generateRandomPassword, hashPassword } from "@/util/crypto.util";
import authenticationHelper from "@/helper/authentication.helper";
import { response } from "@/util/response.util";
export async function POST(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "users",
    permission: 1,
  });
  if (!Auth.success) {
    return response(Auth.message as string, Auth.success, Auth.status);
  }

  const password = generateRandomPassword();
  const newUser = await req.json();

  newUser.password = await hashPassword(password);
  newUser.createdAt = new Date().toISOString();
  newUser.updatedAt = new Date().toISOString();

  try {
    const res = await axiosInstance.post("users", newUser);

    console.table({ password });

    return response("", true, 200, res.data);
  } catch (e: any) {
    return response(e.message, false, 500);
  }
}
