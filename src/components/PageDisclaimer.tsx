import { Info } from "lucide-react";

const PageDisclaimer = () => (
  <div className="flex items-start gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 mb-4">
    <Info size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
    <p className="text-[10px] text-muted-foreground leading-relaxed">
      LVRG is a research and analytics tool. All data is for informational purposes only. We do not encourage gambling. Please bet responsibly.
    </p>
  </div>
);

export default PageDisclaimer;
