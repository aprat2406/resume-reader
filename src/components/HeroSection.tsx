import { Sparkles, Target, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        AI-Powered Resume Analysis
      </div>
      
      <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
        Transform Resumes into
        <br />
        <span className="gradient-hero bg-clip-text text-transparent">
          Meaningful Interview Questions
        </span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload any resume and let AI generate tailored questions that help you 
        truly understand a candidate's expertise and experience.
      </p>

      <div className="flex flex-wrap justify-center gap-6 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4 text-secondary" />
          <span>Targeted Questions</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-secondary" />
          <span>Ready in Seconds</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Multiple Categories</span>
        </div>
      </div>
    </div>
  );
}
