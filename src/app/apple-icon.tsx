import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon (Next.js picks this up automatically as apple-touch-icon). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f2e2b",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", color: "#e5a63c", fontSize: 104, fontWeight: 700, fontFamily: "sans-serif" }}>
          N
        </div>
      </div>
    ),
    { ...size },
  );
}
