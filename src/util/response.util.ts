export const response = (
  message: string,
  success: boolean,
  status: any,
  data?: any
) => {
  return new Response(
    JSON.stringify({
      success,
      message,
      status,
      data,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: status,
    }
  );
};

export const formDataToJson = (
  formData: FormData
): Record<string, string | string[]> => {
  const object: Record<string, string | string[]> = {};
  formData.forEach((value: any, key: any) => {
    if (object.hasOwnProperty(key)) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key] as string];
      }
      (object[key] as string[]).push(value);
    } else {
      object[key] = value;
    }
  });
  return object;
};
