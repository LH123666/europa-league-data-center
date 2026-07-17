import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NORD 16｜挪超数据中心",
  description: "2026 挪超积分榜、比赛结果、赛程与球队数据统计。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
