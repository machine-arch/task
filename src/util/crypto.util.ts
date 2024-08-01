import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { axiosInstance } from "../config/axios.config";

const secret = "test_jwt_secret";

export function generateRandomPassword() {
  return crypto.randomBytes(8).toString("hex");
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(
  userPassword: string,
  hashedPassword: string
) {
  const match = await bcrypt.compare(userPassword, hashedPassword);
  return match;
}

export function generateToken(user: any) {
  const payload = {
    id: user.id,
    username: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: "55h",
  };

  return jwt.sign(payload, secret, options);
}

function includesSome(a: any, b: any) {
  return b.some((element: any) => a.includes(element));
}

export const verifyToken = async (
  token: string,
  required_permission?: any,
  unProtected?: boolean
) => {
  try {
    const decoded: any = jwt.verify(token, secret);

    const role_id = decoded.role;
    console.log(role_id, "role_id");

    if (!role_id) {
      return null;
    }
    const role = await axiosInstance.get(`roles?id=${role_id}`);

    console.log(role?.data[0]);

    if (!role.data[0]) {
      return null;
    }

    let hasPermission = false;

    console.log(typeof required_permission.permission);

    switch (typeof required_permission.permission) {
      case "object":
        console.log(role.data[0].permissions[required_permission.module]);
        hasPermission = includesSome(
          role.data[0].permissions[required_permission.module],
          required_permission.permission
        );
        break;
      case "string":
        console.log(role.data[0].permissions[required_permission.module]);
        hasPermission = role.data[0].permissions[
          required_permission.module
        ].includes(required_permission.permission);
        break;

      case "number":
        hasPermission = role.data[0].permissions[
          required_permission.module
        ].includes(required_permission.permission);
        console.log(hasPermission, "hasPermission");
        break;
    }

    if (hasPermission || unProtected) {
      console.table("permission granted");
      return jwt.verify(token, secret);
    } else {
      console.table("permission denied");
      return null;
    }
  } catch (error) {
    return null;
  }
};
