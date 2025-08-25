export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getOwnedGames(steamId) {
  return fetchJSON(`/api/steam/owned-games?steamId=${encodeURIComponent(steamId)}`);
}

export async function getPlayerSummary(steamId) {
  return fetchJSON(`/api/steam/player-summary?steamId=${encodeURIComponent(steamId)}`);
}

export async function resolveVanity(vanity) {
  return fetchJSON(`/api/steam/resolve-vanity?vanity=${encodeURIComponent(vanity)}`);
}

export async function getCs2Stats(steamId) {
  return fetchJSON(`/api/steam/cs2-stats?steamId=${encodeURIComponent(steamId)}`);
}

export async function getNews(appid, count=3) {
  return fetchJSON(`/api/steam/news?appid=${appid}&count=${count}`);
}
