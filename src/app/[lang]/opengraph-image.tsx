import { ImageResponse } from "next/og";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";

export const alt = "NOVA Hair Studio — Riga";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share preview (WhatsApp, Facebook, Twitter/X, iMessage…).
 * Generated on request from the same copy as the page, so the LV/EN/RU
 * versions of the link each unfurl with the correct headline.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          backgroundColor: "#0f2e2b",
          backgroundImage:
            "radial-gradient(circle at 82% 8%, #1b4b45 0%, rgba(27,75,69,0) 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "#e5a63c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#0f2e2b",
            }}
          >
            N
          </div>
          <div style={{ display: "flex", color: "#f8faf8", fontSize: 30, letterSpacing: 6 }}>
            NOVA
          </div>
          <div style={{ display: "flex", color: "rgba(248,250,248,0.55)", fontSize: 24 }}>
            Hair Studio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div style={{ display: "flex", color: "#f8faf8", fontSize: 58, lineHeight: 1.15 }}>
            {dict.hero.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "rgba(248,250,248,0.68)",
              fontSize: 27,
            }}
          >
            Rīga · Latvia
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
