import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Beaker, FileText, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResultsDisplayProps {
  result: {
    query: string;
    confidence: number;
    diagnoses: Array<{
      condition: string;
      confidence: number;
      reasoning: string;
    }>;
    suggestedTests: string[];
    recommendations: string[];
  };
}

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Query Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Analysis Query</h3>
            <p className="text-sm text-muted-foreground">{result.query}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {result.confidence}% confidence
          </Badge>
        </div>
      </Card>

      {/* Diagnoses */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Possible Diagnoses</h3>
            <p className="text-sm text-muted-foreground">AI-suggested conditions based on case analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          {result.diagnoses.map((diagnosis, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{diagnosis.condition}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Confidence Score</p>
                </div>
                <Badge 
                  variant={diagnosis.confidence > 80 ? "default" : "secondary"}
                  className={diagnosis.confidence > 80 ? "bg-primary" : ""}
                >
                  {diagnosis.confidence}%
                </Badge>
              </div>
              <Progress value={diagnosis.confidence} className="mb-3 h-2" />
              <p className="text-sm text-muted-foreground">{diagnosis.reasoning}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggested Tests */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Beaker className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recommended Tests</h3>
            <p className="text-sm text-muted-foreground">Diagnostic tests to confirm diagnosis</p>
          </div>
        </div>

        <div className="space-y-2">
          {result.suggestedTests.map((test, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="text-sm text-foreground">{test}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Clinical Recommendations</h3>
            <p className="text-sm text-muted-foreground">Next steps and monitoring suggestions</p>
          </div>
        </div>

        <div className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground flex-1">{rec}</p>
              </div>
              {index < result.recommendations.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-muted-foreground/20">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Medical Disclaimer:</strong> This AI analysis is for educational and research purposes only. 
          Always consult with qualified healthcare professionals for clinical decisions. 
          Do not use as a substitute for professional medical judgment.
        </p>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
