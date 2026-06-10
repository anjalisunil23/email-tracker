/// <reference path="../types/localtunnel.d.ts" />
import localtunnel from "localtunnel";
import { setBackendUrl, getBackendUrl } from "../config";

type Tunnel = Awaited<ReturnType<typeof localtunnel>>;
let tunnelInstance: Tunnel | null = null;

export async function startTrackingTunnel(port: number): Promise<string | null> {
  if (process.env.USE_TRACKING_TUNNEL === "false") return null;

  const existing = process.env.BACKEND_URL || "";
  if (existing && !existing.includes("localhost") && !existing.includes("127.0.0.1")) {
    console.log(`[Tunnel] Using configured BACKEND_URL: ${existing}`);
    return existing;
  }

  try {
    // Random subdomain — fixed names often fail or conflict on loca.lt
    tunnelInstance = await localtunnel({ port });

    setBackendUrl(tunnelInstance.url);
    console.log(`[Tunnel] Public tracking URL: ${tunnelInstance.url}`);
    console.log(`[Tunnel] For reliable Gmail tracking, prefer ngrok: npx ngrok http ${port}`);
    console.log(`[Tunnel] Then set BACKEND_URL=https://YOUR-ID.ngrok-free.app in backend/.env`);

    tunnelInstance.on("close", () => {
      console.warn("[Tunnel] Public URL closed — restart server to get a new tunnel URL");
    });

    tunnelInstance.on("error", (err: Error) => {
      console.error("[Tunnel] Error:", err.message);
    });

    return tunnelInstance.url;
  } catch (err: any) {
    console.warn(`[Tunnel] Could not start public tunnel: ${err.message}`);
    console.warn("[Tunnel] Tracking pixels will use localhost (Gmail cannot load these).");
    console.warn("[Tunnel] Set BACKEND_URL to ngrok/deploy URL or install localtunnel access.");
    return getBackendUrl();
  }
}

export function stopTrackingTunnel() {
  if (tunnelInstance) {
    tunnelInstance.close();
    tunnelInstance = null;
  }
}
