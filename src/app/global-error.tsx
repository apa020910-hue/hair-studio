"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

/**
 * Last-resort boundary: only fires if the root layout itself throws.
 * Must render its own <html>/<body> since it replaces the whole tree.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#eef1ef", color: "#14201e", fontFamily: "sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</p>
          <p style={{ marginTop: "0.75rem", color: "#55645f" }}>Please reload the page, or call us directly.</p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                height: "3rem",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                border: "none",
                background: "#e5a63c",
                color: "#0f2e2b",
                fontWeight: 500,
              }}
            >
              Try again
            </button>
            <a
              href={site.phoneHref}
              style={{
                height: "3rem",
                display: "inline-flex",
                alignItems: "center",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                border: "1px solid rgba(15,46,43,0.3)",
                color: "#0f2e2b",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Call: {site.phone}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
