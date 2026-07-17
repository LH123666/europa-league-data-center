import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NORD 16｜挪超数据中心",
  description: "2026 挪超积分榜、比赛结果、赛程与球队数据统计。",
};

export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <meta httpEquiv="refresh" content="0; url=/site/index.html" />
      <p>
        正在进入 NORD 16 数据中心……
        <a href="/site/index.html">立即打开</a>
      </p>
    </main>
  );
}
