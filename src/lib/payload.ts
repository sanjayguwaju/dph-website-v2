import { getPayload } from "payload";
import config from "@payload-config";

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export const getPayloadClient = async () => {
  if (cachedPayload) {
    return cachedPayload;
  }

  try {
    cachedPayload = await getPayload({ config });
    return cachedPayload;
  } catch (error) {
    console.error("Failed to initialize Payload:", error);
    throw error;
  }
};
