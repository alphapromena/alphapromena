import { createRoot } from "react-dom/client";

// Alpha Pro MENA site removed. Black screen only.
// The full application remains in git history and can be restored at any time.
createRoot(document.getElementById("root")!).render(
  <div style={{ position: "fixed", inset: 0, background: "#000000" }} />
);
