import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const STORAGE_KEY = "lvrg-disclaimer-accepted";

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert size={24} className="text-destructive" />
          </div>
          <DialogTitle className="text-center text-lg">
            Disclaimer & Terms of Use
          </DialogTitle>
          <DialogDescription className="text-center">
            Please read and accept before continuing
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 max-h-60 overflow-y-auto rounded-lg border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-3">
            All picks, projections, and analysis provided by <strong className="text-foreground">LVRG</strong> are
            for <strong className="text-foreground">informational and entertainment purposes only</strong>. Nothing
            on this platform constitutes a guarantee of any outcome.
          </p>
          <p className="mb-3">
            Sports betting involves significant financial risk, including the possibility of losing
            your entire wager. <strong className="text-foreground">You are solely responsible</strong> for any
            and all bets you place. LVRG shall not be held liable for any financial losses.
          </p>
          <p className="mb-3">
            The content provided — including AI-generated analysis, prop suggestions, and parlay
            recommendations — <strong className="text-foreground">does not constitute financial advice</strong>.
            Never bet more than you can afford to lose.
          </p>
          <p>
            You must be of legal gambling age in your jurisdiction. By continuing, you confirm you have
            read and agreed to these terms.{" "}
            <Link to="/terms" className="text-primary underline" onClick={() => { localStorage.setItem(STORAGE_KEY, Date.now().toString()); setOpen(false); }}>
              Read full terms →
            </Link>
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
          <Checkbox
            id="disclaimer-accept"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            className="mt-0.5"
          />
          <label htmlFor="disclaimer-accept" className="cursor-pointer text-xs leading-relaxed text-foreground">
            I understand that LVRG does not guarantee any betting outcomes and I accept full
            responsibility for my wagering decisions.
          </label>
        </div>

        <DialogFooter>
          <Button onClick={accept} disabled={!checked} className="w-full">
            I Agree — Continue to LVRG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
