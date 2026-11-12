/** Lightweight text splitter (no paid plugins). Keeps the accessible text via aria-label. */
export type Split = { words: HTMLElement[]; chars: HTMLElement[]; lines: HTMLElement[]; revert: () => void };

export function splitText(el: HTMLElement, opts: { chars?: boolean; lines?: boolean } = {}): Split {
  const original = el.innerHTML;
  const text = (el.textContent || "").trim();
  el.setAttribute("aria-label", text);
  const words: HTMLElement[] = [];
  const chars: HTMLElement[] = [];
  el.innerHTML = "";
  text.split(/\s+/).forEach((w, i, arr) => {
    const wSpan = document.createElement("span");
    wSpan.className = "split-word";
    wSpan.setAttribute("aria-hidden", "true");
    wSpan.style.display = "inline-block";
    wSpan.style.whiteSpace = "nowrap";
    wSpan.style.marginRight = "0.28em";
    if (opts.chars) {
      [...w].forEach((c) => {
        const cs = document.createElement("span");
        cs.className = "split-char";
        cs.style.display = "inline-block";
        cs.textContent = c;
        wSpan.appendChild(cs);
        chars.push(cs);
      });
    } else wSpan.textContent = w;
    el.appendChild(wSpan);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    words.push(wSpan);
  });

  const lines: HTMLElement[] = [];
  if (opts.lines) {
    const groups: HTMLElement[][] = [];
    let lastTop = -9999;
    words.forEach((w) => {
      const top = w.offsetTop;
      if (Math.abs(top - lastTop) > 4) { groups.push([]); lastTop = top; }
      groups[groups.length - 1].push(w);
    });
    el.innerHTML = "";
    groups.forEach((g) => {
      const mask = document.createElement("span");
      mask.className = "split-line";
      mask.style.display = "block";
      mask.style.overflow = "hidden";
      mask.style.paddingBottom = "0.12em";
      mask.style.marginBottom = "-0.12em";
      const inner = document.createElement("span");
      inner.className = "split-line-inner";
      inner.style.display = "block";
      inner.setAttribute("aria-hidden", "true");
      g.forEach((w, i) => { inner.appendChild(w); if (i < g.length - 1) inner.appendChild(document.createTextNode(" ")); });
      mask.appendChild(inner);
      el.appendChild(mask);
      lines.push(inner);
    });
  }
  return { words, chars, lines, revert: () => { el.innerHTML = original; el.removeAttribute("aria-label"); } };
}
