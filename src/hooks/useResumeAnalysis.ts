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

// Convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Extract text from text-based files
async function extractTextFromFile(file: File): Promise<string | null> {
  // For text files, read as text
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }
  
  // For PDFs and other binary formats, return null to indicate server-side parsing needed
  return null;
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
      // Try to extract text from file (works for text files)
      const resumeText = await extractTextFromFile(file);
      
      // For PDFs/binary files, send as base64
      const fileBase64 = resumeText ? null : await fileToBase64(file);

      // Call the edge function (webhook is triggered server-side)
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          resumeText,
          fileBase64,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
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
