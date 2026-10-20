/*
 * Tradecall Pro mockup view beacon (canonical copy; each mockup folder ships its own copy next to its
 * index.html). Reports one page load to the portal so staff know the prospect opened their mockup.
 *
 *   <script src="mockup-beacon.js" data-mockup-id="moore-electric" defer></script>
 *
 * data-mockup-id must match the identifier registered on the prospect record in the portal. The prospect's
 * private key comes from the page address (?k=...). No cookies, nothing stored, nothing shown. It runs when
 * the browser is idle, sends with sendBeacon, and swallows every error, so a slow or down portal never
 * affects the page. Docs: docs/features/mockup-view-tracking.md in the portal repo.
 */
(function () {
  try {
    var tag = document.currentScript;
    if (!tag) return;
    var id = tag.getAttribute("data-mockup-id");
    if (!id) return;
    var endpoint = tag.getAttribute("data-endpoint") || "https://portal.tradecallpro.co/api/mockups/view";
    var key = new URLSearchParams(window.location.search).get("k") || "";
    var body = JSON.stringify({ m: id, k: key });
    function send() {
      try {
        // text/plain keeps this a "simple" request, so the browser skips the CORS preflight.
        if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return;
        fetch(endpoint, { method: "POST", body: body, headers: { "Content-Type": "text/plain" }, keepalive: true, mode: "cors" }).catch(function () {});
      } catch (e) {}
    }
    if (window.requestIdleCallback) window.requestIdleCallback(send, { timeout: 3000 });
    else setTimeout(send, 1500);
  } catch (e) {}
})();
