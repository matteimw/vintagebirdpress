/* ============================================================
   Vintage Bird Press — Share button + popup
   Same setup as the Baldwin Terney Press site: the "Share" button in
   the header (and "Share this site" in the footer) opens a popup with
   Facebook, X, LinkedIn, Instagram, TikTok, WhatsApp, Email and Copy link.

   Edit the wording and address in SHARE_CONFIG below.

   Instagram and TikTok have no web "share this link" page, so on phones
   those buttons open the phone's own share sheet; on computers they copy
   the link and open Instagram/TikTok in a new tab to paste it.

   Shared links get UTM tags (utm_source=facebook, etc.) so analytics can
   show which platform each visitor came from.
   ============================================================ */
const SHARE_CONFIG = {
  siteUrl: "https://www.vintagebirdpress.com",
  siteName: "Vintage Bird Press",
  siteText: "Vintage Bird Press, a new book publisher, is getting ready to take flight. Join the list to hear when the doors open",
  hashtags: "VintageBirdPress,Books,ComingSoon", // X only, no # signs
};

const SHARE_PLATFORMS = [
  { key: "facebook",  label: "Facebook",  icon: "📘", url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { key: "x",         label: "X",         icon: "✖️", url: (u, t) => `https://x.com/intent/post?url=${u}&text=${t}` },
  { key: "linkedin",  label: "LinkedIn",  icon: "💼", url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  { key: "instagram", label: "Instagram", icon: "📸", app: "https://www.instagram.com/" },
  { key: "tiktok",    label: "TikTok",    icon: "🎵", app: "https://www.tiktok.com/" },
  { key: "whatsapp",  label: "WhatsApp",  icon: "💬", url: (u, t) => `https://wa.me/?text=${t}%20${u}` },
  { key: "email",     label: "Email",     icon: "✉️", url: (u, t, s) => `mailto:?subject=${s}&body=${t}%0A%0A${u}` },
  { key: "copy",      label: "Copy link", icon: "🔗" },
];

function withUtm(url, source) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", "share_button");
    return u.toString();
  } catch (e) { return url; }
}

function copyText(text) {
  let ok = false;
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    ok = document.execCommand("copy");
    document.body.removeChild(ta);
  } catch (e) { ok = false; }
  if (!ok && navigator.clipboard) { navigator.clipboard.writeText(text).catch(() => {}); ok = true; }
  return ok;
}

function isPhone() {
  return !!(navigator.share && window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

function buildShareModal() {
  const siteUrl = SHARE_CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const wrap = document.createElement("div");
  wrap.id = "share-modal";
  wrap.className = "share-modal";
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="share-backdrop" data-share-close></div>
    <div class="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">
      <button class="share-close" type="button" aria-label="Close" data-share-close>✕</button>
      <h3 id="share-title">Share ${SHARE_CONFIG.siteName}</h3>
      <p class="share-sub">Know a reader who'd love to hear when we open? Pass it along.</p>
      <div class="share-grid">
        ${SHARE_PLATFORMS.map((p) => `
          <button type="button" class="share-opt share-${p.key}" data-share="${p.key}">
            <span class="share-ico" aria-hidden="true">${p.icon}</span>${p.label}
          </button>`).join("")}
      </div>
      <div class="share-url-row">
        <input type="text" class="share-url" readonly aria-label="Link to share" value="${siteUrl}">
      </div>
      <p class="share-msg" role="status" aria-live="polite"></p>
    </div>`;
  document.body.appendChild(wrap);

  const urlBox = wrap.querySelector(".share-url");
  const msg = wrap.querySelector(".share-msg");
  urlBox.addEventListener("focus", () => urlBox.select());

  wrap.addEventListener("click", (e) => {
    if (e.target.closest("[data-share-close]")) { closeShareModal(); return; }
    const btn = e.target.closest("[data-share]");
    if (!btn) return;
    const p = SHARE_PLATFORMS.find((x) => x.key === btn.dataset.share);
    const link = withUtm(siteUrl, p.key);
    const tags = SHARE_CONFIG.hashtags;
    const text = SHARE_CONFIG.siteText + (tags && p.key === "x" ? " " + tags.split(",").map((h) => "#" + h.trim()).join(" ") : "");
    if (window.gtag) window.gtag("event", "share", { method: p.key, content_type: "page", item_id: siteUrl });

    if (p.key === "copy") { copyText(link); msg.textContent = "✅ Link copied — paste it anywhere."; return; }
    if (p.app) {
      if (isPhone()) { navigator.share({ title: SHARE_CONFIG.siteName, text: SHARE_CONFIG.siteText, url: link }).catch(() => {}); return; }
      copyText(link);
      msg.textContent = `✅ Link copied! Paste it into your ${p.label} post, story, bio or message.`;
      window.open(p.app, "_blank", "noopener");
      return;
    }
    const href = p.url(encodeURIComponent(link), encodeURIComponent(text), encodeURIComponent(SHARE_CONFIG.siteName));
    if (p.key === "email") { window.location.href = href; return; }
    window.open(href, "_blank", "noopener,width=640,height=600");
  });
  return wrap;
}

let shareReturnFocus = null;
function openShareModal() {
  const m = document.getElementById("share-modal") || buildShareModal();
  m.querySelector(".share-msg").textContent = "";
  shareReturnFocus = document.activeElement;
  m.hidden = false;
  document.body.classList.add("share-open");
  const first = m.querySelector(".share-opt");
  if (first) first.focus();
}

function closeShareModal() {
  const m = document.getElementById("share-modal");
  if (!m || m.hidden) return;
  m.hidden = true;
  document.body.classList.remove("share-open");
  if (shareReturnFocus && shareReturnFocus.focus) shareReturnFocus.focus();
}

document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest("[data-share-open]")) { e.preventDefault(); openShareModal(); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeShareModal(); });
