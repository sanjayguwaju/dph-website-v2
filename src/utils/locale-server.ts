import { cookies } from "next/headers";

export const COOKIE_NAME = "NEXT_LOCALE";
export const DEFAULT_LOCALE = "ne";

export async function getLocale() {
    const cookieStore = await cookies();
    const locale = cookieStore.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
    return locale;
}
