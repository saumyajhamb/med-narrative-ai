import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, FileImage, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QueryInterfaceProps {
  onQuery: (query: string) => void;
  caseData: any;
}

const QueryInterface = ({ onQuery, caseData }: QueryInterfaceProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) return;
    onQuery(query);
    setQuery("");
  };

  const suggestedQueries = [
    "What conditions should I consider based on the X-ray and symptoms?",
    "What are the recommended diagnostic tests for this case?",
    "Explain the radiological findings in detail",
    "What treatment options would you suggest?",
    "Are there any red flags I should be aware of?",
  ];

  return (
    <div className="space-y-6">
      {/* Case Summary */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Active Case</h3>
        </div>
        <div className="flex gap-4">
          {caseData?.images?.length > 0 && (
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{caseData.images.length} image(s)</Badge>
            </div>
          )}
          {caseData?.notes && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">Clinical notes added</Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Query Input */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">Ask Your Question</h3>
          <p className="text-sm text-muted-foreground">
            Use natural language to query the AI about diagnoses, tests, or treatment recommendations
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Example: What conditions should I consider based on the X-ray and reported symptoms?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Press Cmd/Ctrl + Enter to submit</p>
            <Button onClick={handleSubmit} disabled={!query.trim()} className="shadow-md">
              <Send className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
        </div>
      </Card>

      {/* Suggested Queries */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-3">Suggested Queries</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setQuery(suggestion)}
              className="text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QueryInterface;
