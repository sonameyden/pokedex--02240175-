const BASE = 'https://pokeapi.co/api/v2';
export const artwork = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}
const idFrom = (url) => Number(url.split('/').filter(Boolean).pop());
const shape = (p) => ({ id: idFrom(p.url), name: p.name });

export async function fetchPage(offset, limit = 20) {
  const d = await getJson(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
  return { items: d.results.map(shape), hasMore: d.next !== null };
}
export async function fetchAllNames() {
  const d = await getJson(`${BASE}/pokemon?limit=1025`);
  return d.results.map(shape);
}
export async function fetchDetail(id) {
  const d = await getJson(`${BASE}/pokemon/${id}`);
  return {
    id: d.id,
    name: d.name,
    types: d.types.map((t) => t.type.name),
    height: d.height / 10, // dm -> m
    weight: d.weight / 10, // hg -> kg
    stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  };
}
