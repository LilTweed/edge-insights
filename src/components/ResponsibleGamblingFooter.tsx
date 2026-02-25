import { Link } from "react-router-dom";

const ResponsibleGamblingFooter = () => (
  <footer className="border-t border-border bg-card/50 py-4 mt-auto">
    <div className="container flex flex-col items-center gap-2 text-center">
      <p className="text-[10px] text-muted-foreground max-w-xl leading-relaxed">
        LVRG is a research and analytics tool. All data is for informational purposes only. We do not encourage gambling. Please bet responsibly.
      </p>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <Link to="/terms" className="hover:text-foreground transition-colors underline">Terms</Link>
        <span>·</span>
        <a href="https://www.ncpgambling.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
          Responsible Gambling Resources
        </a>
        <span>·</span>
        <a href="https://www.1800gambler.net/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
          1-800-GAMBLER
        </a>
      </div>
    </div>
  </footer>
);

export default ResponsibleGamblingFooter;
