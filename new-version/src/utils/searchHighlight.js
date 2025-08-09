// Idempotent, DOM-based highlighter for HTML and plain text.
// - Removes any previous <mark class="search-highlight"> wrappers first.
// - Case-insensitive, accent-insensitive (diacritics ignored for matching),
//   but preserves original text content when rendering.
// - Operates on text nodes only so tags/attributes are never touched.

/**
 * Escape RegExp special characters.
 */
function escapeRegExp(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Normalize string for matching:
 * - Lowercase
 * - Remove diacritics
 */
function normalizeForMatch(s = "") {
  try {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  } catch {
    return s.toLowerCase();
  }
}

/**
 * Escape HTML entities in plain text so we can safely inject via innerHTML.
 */
function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Remove existing <mark class="search-highlight">...</mark> wrappers.
 */
function stripExistingHighlights(root) {
  const marks = root.querySelectorAll("mark.search-highlight");
  marks.forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    const textNode = document.createTextNode(m.textContent || "");
    parent.replaceChild(textNode, m);
    parent.normalize(); // merge adjacent text nodes
  });
}

/**
 * Split a text node into a DocumentFragment with highlighted matches.
 * Matching is done on normalized text, but original characters are preserved.
 */
function highlightInTextNode(node, queryNorm) {
  const text = node.nodeValue || "";
  if (!text) return null;

  const textNorm = normalizeForMatch(text);
  const qLen = queryNorm.length;
  if (!qLen) return null;

  const frag = document.createDocumentFragment();
  let i = 0;

  while (i <= text.length) {
    const idx = textNorm.indexOf(queryNorm, i);
    if (idx === -1) {
      frag.appendChild(document.createTextNode(text.slice(i)));
      break;
    }
    if (idx > i) {
      frag.appendChild(document.createTextNode(text.slice(i, idx)));
    }
    const matched = text.slice(idx, idx + qLen);
    const mark = document.createElement("mark");
    mark.className = "search-highlight";
    mark.textContent = matched;
    frag.appendChild(mark);
    i = idx + qLen;
  }

  return frag;
}

/**
 * Highlight plain text → HTML.
 * - Escapes HTML
 * - Case-insensitive, accent-insensitive
 * - Returns HTML string with <mark> tags
 */
export function highlightPlainTextToHTML(text = "", query = "") {
  const q = (query || "").trim();
  if (!q) return escapeHTML(text || "");

  const safe = escapeHTML(text || "");
  const template = document.createElement("template");
  template.innerHTML = safe;

  const queryNorm = normalizeForMatch(q);
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_TEXT,
    null
  );
  const replaces = [];

  let node = walker.nextNode();
  while (node) {
    const frag = highlightInTextNode(node, queryNorm);
    if (frag) replaces.push([node, frag]);
    node = walker.nextNode();
  }

  for (const [n, f] of replaces) {
    n.parentNode.replaceChild(f, n);
  }

  const container = document.createElement("div");
  container.appendChild(template.content.cloneNode(true));
  return container.innerHTML;
}

/**
 * Highlight inside an HTML string.
 * - Removes old highlights first (idempotent)
 * - Case-insensitive, accent-insensitive
 * - Works only on text nodes (preserves HTML structure)
 */
export function highlightHTMLString(html = "", query = "") {
  const q = (query || "").trim();
  if (!q) return html;

  const template = document.createElement("template");
  template.innerHTML = html;

  // Remove any existing highlights
  stripExistingHighlights(template.content);

  const queryNorm = normalizeForMatch(q);
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_TEXT,
    null
  );
  const toReplace = [];

  let node = walker.nextNode();
  while (node) {
    const frag = highlightInTextNode(node, queryNorm);
    if (frag) toReplace.push([node, frag]);
    node = walker.nextNode();
  }

  for (const [textNode, fragment] of toReplace) {
    const parent = textNode.parentNode;
    if (parent) parent.replaceChild(fragment, textNode);
  }

  const container = document.createElement("div");
  container.appendChild(template.content.cloneNode(true));
  return container.innerHTML;
}
