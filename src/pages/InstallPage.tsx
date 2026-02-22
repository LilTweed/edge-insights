import { useState, useEffect } from "react";
import { Download, Smartphone, Monitor, CheckCircle2 } from "lucide-react";

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="container py-12 max-w-lg mx-auto text-center">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Smartphone className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Install LVRG</h1>
        <p className="text-sm text-muted-foreground">
          Add LVRG to your home screen for instant access, offline support, and a native app experience.
        </p>
      </div>

      {isStandalone || installed ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-500" />
          <p className="font-semibold text-foreground">Already installed!</p>
          <p className="text-sm text-muted-foreground mt-1">
            You're running LVRG as an app.
          </p>
        </div>
      ) : deferredPrompt ? (
        <button
          onClick={handleInstall}
          className="w-full rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-5 w-5" />
          Install LVRG App
        </button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 text-left space-y-3">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">iPhone / iPad</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap the <strong>Share</strong> button in Safari, then <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Android</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap the <strong>menu (⋮)</strong> in Chrome, then <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Monitor className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Desktop</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click the install icon in your browser's address bar, or use Chrome menu → <strong>"Install LVRG"</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">What you get</p>
        <div className="grid grid-cols-3 gap-2">
          {["Instant Launch", "Offline Ready", "Full Screen"].map((f) => (
            <div key={f} className="rounded-lg bg-secondary/50 py-2 px-3 text-[11px] font-medium text-muted-foreground">
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstallPage;
