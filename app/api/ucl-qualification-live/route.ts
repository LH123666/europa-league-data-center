const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard?dates=20260804-20260812&limit=100";

type LiveMatch = {
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  completed: boolean;
  inProgress: boolean;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const response = await fetch(ESPN_URL, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Score feed returned ${response.status}`);
    const payload = await response.json() as { events?: Array<Record<string, any>> };
    const matches: LiveMatch[] = (payload.events || []).flatMap((event) => {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors || [];
      const home = competitors.find((item: any) => item.homeAway === "home");
      const away = competitors.find((item: any) => item.homeAway === "away");
      if (!home || !away) return [];
      return [{
        date: event.date,
        home: home.team?.displayName || home.team?.shortDisplayName || "",
        away: away.team?.displayName || away.team?.shortDisplayName || "",
        homeScore: Number(home.score || 0),
        awayScore: Number(away.score || 0),
        completed: Boolean(event.status?.type?.completed),
        inProgress: Boolean(event.status?.type?.state === "in"),
      }];
    });
    return Response.json({
      live: matches.some((match) => match.completed || match.inProgress),
      source: "实时赛果接口",
      checkedAt: new Date().toISOString(),
      matches,
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return Response.json({
      live: false,
      source: "UEFA最后核对数据",
      checkedAt: new Date().toISOString(),
      matches: [],
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } finally {
    clearTimeout(timeout);
  }
}
