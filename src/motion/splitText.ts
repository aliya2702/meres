/** Lightweight text splitter (no paid plugins). Keeps the accessible text via aria-label. */
export type Split = { words: HTMLElement[]; chars: HTMLElement[]; lines: HTMLElement[]; revert: () => void };

const originalMarkup = new WeakMap<HTMLElement, string>();

export function splitText(el: HTMLElement, opts: { chars?: boolean; lines?: boolean } = {}): Split {
  if (!originalMarkup.has(el)) {
    originalMarkup.set(el, el.innerHTML);
  } else {
    el.innerHTML = originalMarkup.get(el)!;
  }

  const original = originalMarkup.get(el)!;
  const text = (el.textContent || "").trim();
  el.setAttribute("aria-label", text);
  const words: HTMLElement[] = [];
  const chars: HTMLElement[] = [];
  el.innerHTML = "";
  text.split(/\s+/).filter(Boolean).forEach((w, i, arr) => {
    const wSpan = document.createElement("span");
    wSpan.className = "split-word";
    wSpan.setAttribute("aria-hidden", "true");
    wSpan.style.display = "inline-block";
    wSpan.style.whiteSpace = "nowrap";
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
    groups.forEach((g, lineIdx) => {
      const mask = document.createElement("span");
      mask.className = "split-line";
      mask.style.display = "block";
      mask.style.overflow = "hidden";
      mask.style.paddingTop = "0.08em";
      mask.style.marginTop = "-0.08em";
      mask.style.paddingBottom = "0.18em";
      mask.style.marginBottom = "-0.18em";
      mask.style.paddingLeft = "0.06em";
      mask.style.marginLeft = "-0.06em";
      mask.style.paddingRight = "0.06em";
      mask.style.marginRight = "-0.06em";
      const inner = document.createElement("span");
      inner.className = "split-line-inner";
      inner.style.display = "block";
      inner.setAttribute("aria-hidden", "true");
      g.forEach((w, i) => { inner.appendChild(w); if (i < g.length - 1) inner.appendChild(document.createTextNode(" ")); });
      mask.appendChild(inner);
      el.appendChild(mask);
      if (lineIdx < groups.length - 1) el.appendChild(document.createTextNode(" "));
      lines.push(inner);
    });
  }
  return {
    words,
    chars,
    lines,
    revert: () => {
      el.innerHTML = original;
      el.removeAttribute("aria-label");
      originalMarkup.delete(el);
    },
  };
}
