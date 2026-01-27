import { FileSearch } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <FileSearch className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-foreground">ResumeIQ</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Interview Questions</p>
          </div>
        </div>
      </div>
    </header>
  );
}
