import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FileUpload } from "@/components/FileUpload";
import { QuestionsList } from "@/components/QuestionsList";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const { analyzeResume, isLoading, result, error, reset } = useResumeAnalysis();

  return (
    <div className="min-h-screen gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!result ? (
          <div className="space-y-12">
            <HeroSection />
            
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <FileUpload 
                onFileSelect={analyzeResume}
                isLoading={isLoading}
              />
            </div>

            {error && (
              <div className="text-center p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-fade-in">
                <p className="font-medium">Something went wrong</p>
                <p className="text-sm mt-1 opacity-80">{error}</p>
              </div>
            )}

            {/* How it works */}
            <div className="grid md:grid-cols-3 gap-6 pt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-display font-bold text-primary">1</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Upload Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload a PDF or DOC resume file
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-display font-bold text-secondary">2</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI reads and understands the candidate's experience and skills
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-display font-bold text-accent">3</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Get Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive tailored interview questions organized by category
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={reset}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another Resume
              </Button>
            </div>
            
            <QuestionsList 
              questions={result.questions}
              candidateName={result.candidateName || undefined}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ResumeIQ — Helping interviewers ask the right questions</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
