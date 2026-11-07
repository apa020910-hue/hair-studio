import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

export const config = {
  // Skip Next.js internals, API routes, Next's file-convention metadata routes
  // (apple-icon, icon, opengraph-image, twitter-image — served without a file
  // extension in the URL) and anything that looks like a static file.
  matcher: ["/((?!_next|api|apple-icon|icon|opengraph-image|twitter-image|.*\\..*).*)"],
};

/** Redirects "/" and locale-less paths to the browser's preferred language, defaulting to Latvian. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first] = pathname.split("/");
  if (isLocale(first)) return NextResponse.next();

  const accepted = request.headers.get("accept-language") ?? "";
  const preferred = accepted
    .split(",")
    .map((part) => part.split(";")[0]!.trim().slice(0, 2).toLowerCase());
  const locale = preferred.find(isLocale) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
