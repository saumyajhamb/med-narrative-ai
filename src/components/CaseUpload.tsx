import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileImage, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface CaseUploadProps {
  onUpload: (data: any) => void;
}

const CaseUpload = ({ onUpload }: CaseUploadProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length === 0 && !notes.trim()) {
      toast.error("Please upload at least one image or add clinical notes");
      return;
    }

    onUpload({
      images,
      notes,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Upload Patient Case</h2>
        <p className="text-muted-foreground">
          Upload medical images (X-rays, MRIs, CT scans) and clinical notes for AI analysis
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Upload */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileImage className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Medical Images</h3>
              <p className="text-sm text-muted-foreground">Upload X-rays, MRIs, CT scans, or lab results</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, JPEG, or DICOM files</p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center border border-border overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Clinical Notes */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Clinical Notes</h3>
              <p className="text-sm text-muted-foreground">Add patient symptoms, history, and observations</p>
            </div>
          </div>

          <Textarea
            placeholder="Enter clinical notes, patient symptoms, medical history, lab results, etc.&#10;&#10;Example:&#10;- Patient: 45yo male&#10;- Chief complaint: Persistent cough, fever (101°F)&#10;- History: Non-smoker, no chronic conditions&#10;- Physical exam: Bilateral lung crackles&#10;- Duration: 5 days"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => {
            setImages([]);
            setNotes("");
            toast.info("Case cleared");
          }}>
            Clear All
          </Button>
          <Button onClick={handleSubmit} size="lg" className="shadow-md hover:shadow-glow transition-all">
            <Upload className="mr-2 h-5 w-5" />
            Upload & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseUpload;
