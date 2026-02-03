import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

interface Question {
  question: string;
  category: string;
  context?: string;
}

interface AnalysisResult {
  candidateName: string | null;
  questions: Question[];
}

// Extract text from PDF using pdf.js
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText;
}

// Extract text from common file types
async function extractTextFromFile(file: File): Promise<string> {
  // For PDF files, use pdf.js
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  }
  
  // For text-based files, read as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
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

      // Call the edge function (webhook is triggered server-side)
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          resumeText,
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
