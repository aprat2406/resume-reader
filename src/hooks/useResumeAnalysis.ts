import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Question {
  question: string;
  category: string;
  context?: string;
}

interface AnalysisResult {
  candidateName: string | null;
  questions: Question[];
}

// Simple text extraction from common file types
async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // For text-based files, return content directly
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        resolve(content);
        return;
      }
      
      // For PDF files, extract readable text (basic extraction)
      if (file.type === "application/pdf") {
        // PDF parsing is complex - we'll send the raw content and let the AI handle it
        // In production, you'd use a proper PDF parser
        resolve(content);
        return;
      }
      
      // For DOC/DOCX, we'll also pass the content
      resolve(content);
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    if (file.type === "application/pdf") {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
}

export function useResumeAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error("Could not extract enough text from the resume. Please ensure the file contains readable text content.");
      }

      // Call the edge function
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to analyze resume");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Analysis Complete!",
        description: `Generated ${data.questions?.length || 0} interview questions`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze resume";
      setError(message);
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeResume,
    isLoading,
    result,
    error,
    reset,
  };
}
