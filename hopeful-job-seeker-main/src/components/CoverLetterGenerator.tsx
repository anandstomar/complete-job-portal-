
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Wand2, Copy } from "lucide-react";

interface CoverLetterGeneratorProps {
  onBack: () => void;
}

const CoverLetterGenerator = ({ onBack }: CoverLetterGeneratorProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    recruiterName: "",
    yourExperience: "",
    whyInterested: ""
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCoverLetter = async () => {
    if (!formData.jobTitle || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the job title and company name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with realistic delay
    setTimeout(() => {
      const letter = `Dear ${formData.recruiterName || "Hiring Manager"},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. Having researched your company extensively, I am excited about the opportunity to contribute to your team and help drive ${formData.companyName}'s continued success.

${formData.yourExperience || "With my background in technology and problem-solving, I am confident in my ability to make meaningful contributions to your organization. My experience has equipped me with strong analytical skills and the ability to work effectively in collaborative environments."}

${formData.whyInterested || `What particularly attracts me to ${formData.companyName} is your commitment to innovation and excellence. I am eager to bring my skills and enthusiasm to your team and contribute to the exciting projects ahead.`}

I am particularly drawn to this role because it aligns perfectly with my career goals and passion for making a positive impact. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success.

Thank you for considering my application. I look forward to hearing from you soon and discussing how I can contribute to ${formData.companyName}'s continued growth.

Sincerely,
[Your Name]`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
      
      // Save cover letter to localStorage
      const coverLetters = JSON.parse(localStorage.getItem("userCoverLetters") || "[]");
      const newCoverLetter = {
        id: Date.now().toString(),
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        content: letter,
        createdAt: new Date().toISOString()
      };
      coverLetters.push(newCoverLetter);
      localStorage.setItem("userCoverLetters", JSON.stringify(coverLetters));
      
      toast({
        title: "Cover Letter Generated!",
        description: "Your personalized cover letter is ready and saved."
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied to Clipboard!",
      description: "Cover letter copied successfully."
    });
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${formData.companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    
    toast({
      title: "Cover Letter Downloaded!",
      description: "Your cover letter has been downloaded."
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">AI Cover Letter Generator</h1>
          <p className="text-gray-600">Create personalized cover letters with AI assistance</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="e.g., Software Developer"
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>

              <div>
                <Label htmlFor="recruiterName">Recruiter Name (Optional)</Label>
                <Input
                  id="recruiterName"
                  value={formData.recruiterName}
                  onChange={(e) => handleInputChange("recruiterName", e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <Label htmlFor="yourExperience">Your Experience Summary</Label>
                <Textarea
                  id="yourExperience"
                  value={formData.yourExperience}
                  onChange={(e) => handleInputChange("yourExperience", e.target.value)}
                  placeholder="Briefly describe your relevant experience and skills..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="whyInterested">Why This Company/Role?</Label>
                <Textarea
                  id="whyInterested"
                  value={formData.whyInterested}
                  onChange={(e) => handleInputChange("whyInterested", e.target.value)}
                  placeholder="What interests you about this role or company..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={generateCoverLetter} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>

            {/* Generated Letter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Cover Letter</h3>
                {generatedLetter && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadLetter}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg min-h-[400px]">
                {generatedLetter ? (
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {generatedLetter}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Fill in the details and click "Generate Cover Letter" to create your personalized cover letter.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
