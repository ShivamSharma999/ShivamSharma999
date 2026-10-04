import { ImageResponse } from "next/og";
export const alt = "Shivam Sharma, Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 80,
        color: "#f4efe6",
        background:
          "radial-gradient(circle at 78% 30%, #ff9f43 0%, #7c5cff 30%, #070b1a 62%)",
      }}
    >
      <div style={{ fontSize: 30, opacity: 0.8 }}>shivam.click</div>
      <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1 }}>
        Shivam Sharma
      </div>
      <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9 }}>
        Full-Stack Developer · Web, Desktop &amp; AI
      </div>
    </div>,
    size,
  );
}
