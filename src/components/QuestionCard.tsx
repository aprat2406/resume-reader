import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  category: string;
  index: number;
  context?: string;
}

const categoryColors: Record<string, string> = {
  technical: "bg-primary/10 text-primary border-primary/20",
  experience: "bg-secondary/10 text-secondary border-secondary/20",
  behavioral: "bg-accent/10 text-accent border-accent/20",
  education: "bg-muted text-muted-foreground border-muted",
  projects: "bg-primary/10 text-primary border-primary/20",
  skills: "bg-secondary/10 text-secondary border-secondary/20",
};

export function QuestionCard({ question, category, index, context }: QuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorClass = categoryColors[category.toLowerCase()] || categoryColors.technical;

  return (
    <div
      className={cn(
        "group bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all duration-300",
        "border border-border hover:border-secondary/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2.5 py-0.5 text-xs font-medium rounded-full border",
              colorClass
            )}>
              {category}
            </span>
            <span className="text-xs text-muted-foreground">Q{index + 1}</span>
          </div>
          
          <p className="text-foreground font-medium leading-relaxed">{question}</p>
          
          {context && (
            <div className="pt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Hide context" : "Show context"}
              </button>
              {expanded && (
                <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {context}
                </p>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-muted",
            copied && "opacity-100 bg-secondary/10"
          )}
        >
          {copied ? (
            <Check className="w-4 h-4 text-secondary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
