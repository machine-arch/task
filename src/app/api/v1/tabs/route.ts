import authenticationHelper from "@/helper/authentication.helper";
import { axiosInstance } from "../../../../config/axios.config";
import { response } from "@/util/response.util";

export async function GET(req: Request, res: Response) {
  const Auth = await authenticationHelper.verifyRequest(req, {
    module: "tabs",
    permission: [1, 2, 3, 4],
  });
  if (!Auth.success) {
    return response(Auth.message as string, false, Auth.status, null);
  }

  const url = req.url;
  const parsedUrl = new URL(url);
  const queryParams = new URLSearchParams(parsedUrl.search);

  const queryParts: any[] = [];

  const parameters = ["name", "name_code", "document_level_id"];
  parameters.forEach((param) => {
    const value = queryParams.get(param);
    if (value) {
      queryParts.push(`${param}=${encodeURIComponent(value)}`);
    }
  });

  let tabsUrl = "tabs";
  if (queryParts.length) {
    tabsUrl += "?" + queryParts.join("&");
  }

  try {
    const tabs = await axiosInstance.get(tabsUrl);
    if (!tabs.data) {
      return response("No role found", false, 404);
    }

    return response("", true, 200, tabs.data);
  } catch (e: any) {
    console.log(e);
    return response(e.message, false, 500);
  }
}
