import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Upload, MessageSquare, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import CaseUpload from "@/components/CaseUpload";
import QueryInterface from "@/components/QueryInterface";
import ResultsDisplay from "@/components/ResultsDisplay";

const Index = () => {
  const [activeView, setActiveView] = useState<"home" | "upload" | "query">("home");
  const [caseData, setCaseData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleCaseUpload = (data: any) => {
    setCaseData(data);
    toast.success("Case uploaded successfully");
    setActiveView("query");
  };

  const handleQuery = async (query: string) => {
    toast.info("Analyzing your query with AI...");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-case`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            caseData,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze case');
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast.success("AI analysis complete");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze case');
    }
  };

  return (
    <div className="min-h-screen bg-subtle-gradient">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setActiveView("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-medical-gradient flex items-center justify-center shadow-glow">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MedQueryAI</h1>
              <p className="text-xs text-muted-foreground">Clinical Intelligence Assistant</p>
            </div>
          </button>
          <div className="flex gap-2">
            <Button 
              variant={activeView === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Case
            </Button>
            <Button 
              variant={activeView === "query" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("query")}
              disabled={!caseData}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Query
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeView === "home" && (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 pt-12 pb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Powered by Advanced Multimodal AI
              </div>
              <h2 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligent Clinical Decision Support
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Upload medical images and clinical notes to receive AI-powered diagnostic insights, 
                evidence-based suggestions, and comprehensive case analysis.
              </p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setActiveView("upload")}
                  className="shadow-lg hover:shadow-glow transition-all"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Multimodal Upload</h3>
                <p className="text-muted-foreground">
                  Upload X-rays, MRIs, lab reports, and clinical notes in a unified interface.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Natural Language Queries</h3>
                <p className="text-muted-foreground">
                  Ask questions in plain English and receive comprehensive, evidence-based answers.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Get diagnostic suggestions, confidence scores, and recommended tests instantly.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">89%</div>
                  <div className="text-sm text-muted-foreground">Avg. Confidence</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">&lt;2s</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">5+</div>
                  <div className="text-sm text-muted-foreground">AI Models</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "upload" && <CaseUpload onUpload={handleCaseUpload} />}
        
        {activeView === "query" && (
          <div className="max-w-6xl mx-auto">
            <QueryInterface onQuery={handleQuery} caseData={caseData} />
            {analysisResult && <ResultsDisplay result={analysisResult} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
