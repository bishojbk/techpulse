import { isTauri } from "./tauri";

export async function openUrl(url: string) {
  if (isTauri()) {
    const { openUrl: tauriOpen } = await import("@tauri-apps/plugin-opener");
    await tauriOpen(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
