// @ts-check
/**
 * Node-Indizes in Anzeigereihenfolge: '' = A–Z (Titel), 'alt'/'neu' = nach Jahr (ohne Jahr ans Ende, sonst A–Z).
 * @param {{title: string, year?: string|number|null}[]} nodes
 * @param {string} sort
 */
export function order(nodes, sort) {
  const year = (/** @type {number} */ i) => parseInt(String(nodes[i].year)) || null;
  const dir = sort === 'neu' ? -1 : 1;
  return nodes
    .map((_, i) => i)
    .sort((a, b) => {
      const ya = year(a);
      const yb = year(b);
      if (sort && ya !== yb) return ya === null ? 1 : yb === null ? -1 : (ya - yb) * dir;
      return nodes[a].title.localeCompare(nodes[b].title, 'de');
    });
}
