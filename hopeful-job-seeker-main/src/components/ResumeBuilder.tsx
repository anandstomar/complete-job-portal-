import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Save, User, Briefcase, GraduationCap, Award, Eye, FileText } from "lucide-react";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  candidateType: "fresher" | "experienced";
  selectedTemplate: number;
}

interface ResumeBuilderProps {
  onBack: () => void;
}

const ResumeBuilder = ({ onBack }: ResumeBuilderProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"type" | "template" | "form">("type");
  const [formData, setFormData] = useState<ResumeData>({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    // Experience
    experiences: [{ company: "", position: "", duration: "", description: "" }],
    // Education
    education: [{ institution: "", degree: "", year: "", gpa: "" }],
    // Skills
    skills: "",
    // Projects
    projects: [{ name: "", description: "", technologies: "" }],
    candidateType: "fresher",
    selectedTemplate: 1
  });

  const handleInputChange = (section: string, field: string, value: string, index?: number) => {
    if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        [section]: (prev[section as keyof ResumeData] as any[]).map((item: any, i: number) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSection = (section: string) => {
    const newItem = section === "experiences" 
      ? { company: "", position: "", duration: "", description: "" }
      : section === "education"
      ? { institution: "", degree: "", year: "", gpa: "" }
      : { name: "", description: "", technologies: "" };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section as keyof ResumeData] as any[]), newItem]
    }));
  };

  const generateAISummary = () => {
    const fresherSummaries = [
      "Enthusiastic and motivated recent graduate with a strong foundation in technology and problem-solving. Eager to apply academic knowledge in a professional environment and contribute to innovative projects.",
      "Fresh graduate with excellent communication skills and a passion for learning. Ready to bring creativity and dedication to a dynamic team while growing professionally.",
      "Recent graduate with strong analytical abilities and attention to detail. Committed to continuous learning and excited to start a career in technology."
    ];
    
    const experiencedSummaries = [
      "Results-driven professional with proven experience in delivering high-quality solutions. Strong background in project management and team collaboration with a track record of exceeding expectations.",
      "Experienced professional with expertise in multiple technologies and business domains. Demonstrated ability to lead projects and mentor junior team members while driving innovation.",
      "Seasoned professional with extensive experience in problem-solving and strategic thinking. Proven ability to adapt to new technologies and deliver impactful results."
    ];
    
    const summaries = formData.candidateType === "fresher" ? fresherSummaries : experiencedSummaries;
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    setFormData(prev => ({ ...prev, summary: randomSummary }));
    
    toast({
      title: "AI Summary Generated!",
      description: "Your professional summary has been created using AI."
    });
  };

  const saveResume = () => {
    localStorage.setItem("userResume", JSON.stringify(formData));
    toast({
      title: "Resume Saved!",
      description: "Your resume has been saved successfully."
    });
  };

  const downloadResume = () => {
    const resumeData = JSON.stringify(formData, null, 2);
    const blob = new Blob([resumeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    
    toast({
      title: "Resume Downloaded!",
      description: "Your resume has been downloaded as a JSON file."
    });
  };

  const handleTemplateSelect = (templateId: number) => {
    if (templateId > 1) {
      toast({
        title: "Premium Template",
        description: "This template requires a premium subscription. Redirecting to payment...",
        variant: "destructive"
      });
      return;
    }
    setFormData(prev => ({ ...prev, selectedTemplate: templateId }));
    setStep("form");
  };

  // Candidate Type Selection
  if (step === "type") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Let's Build Your Resume</h1>
          <p className="text-gray-600 mb-8">First, tell us about your experience level</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => {
                setFormData(prev => ({ ...prev, candidateType: "fresher" }));
                setStep("template");
              }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            >
              <GraduationCap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">I'm a Fresher</h3>
              <p className="text-gray-600">Recent graduate or new to the job market</p>
            </div>
            
            <div 
              onClick={() => {
                setFormData(prev => ({ ...prev, candidateType: "experienced" }));
                setStep("template");
              }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            >
              <Briefcase className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">I'm Experienced</h3>
              <p className="text-gray-600">Have work experience in my field</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Template Selection
  if (step === "template") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setStep("type")} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Choose Your Template</h1>
          <p className="text-gray-600 mb-8 text-center">Select a professional template for your resume</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Template */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Classic Template</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Classic Resume</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">FREE</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Clean and professional design</p>
                <Button onClick={() => handleTemplateSelect(1)} className="w-full">
                  Select Template
                </Button>
              </div>
            </div>

            {/* Premium Template 1 */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden opacity-75">
              <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Modern Template</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Modern Resume</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">PREMIUM</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Stylish design with modern elements</p>
                <Button onClick={() => handleTemplateSelect(2)} variant="outline" className="w-full">
                  Select Template ($9.99)
                </Button>
              </div>
            </div>

            {/* Premium Template 2 */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden opacity-75">
              <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Executive Template</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Executive Resume</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">PREMIUM</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Professional design for executives</p>
                <Button onClick={() => handleTemplateSelect(3)} variant="outline" className="w-full">
                  Select Template ($14.99)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form Step
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setStep("template")} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={saveResume}>
            <Save className="w-4 h-4 mr-2" />
            Save Resume
          </Button>
          <Button onClick={downloadResume}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">
                Building resume for {formData.candidateType} • Template {formData.selectedTemplate}
              </p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="p-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Skills</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("", "fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("", "email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("", "phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("", "location", e.target.value)}
                  placeholder="Enter your location"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Button variant="outline" size="sm" onClick={generateAISummary}>
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => handleInputChange("", "summary", e.target.value)}
                placeholder="Write a brief professional summary..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            {formData.candidateType === "experienced" ? (
              <>
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => handleInputChange("experiences", "company", e.target.value, index)}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => handleInputChange("experiences", "position", e.target.value, index)}
                          placeholder="Job title"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => handleInputChange("experiences", "duration", e.target.value, index)}
                        placeholder="e.g., Jan 2020 - Present"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleInputChange("experiences", "description", e.target.value, index)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addSection("experiences")}>
                  Add Experience
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Experience Yet?</h3>
                <p className="text-gray-600 mb-4">That's perfectly fine! Focus on your education, projects, and skills.</p>
                <Button variant="outline" onClick={() => addSection("experiences")}>
                  Add Internship/Part-time Work
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
                      placeholder="University/School name"
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleInputChange("education", "degree", e.target.value, index)}
                      placeholder="Degree/Course name"
                    />
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Input
                      value={edu.year}
                      onChange={(e) => handleInputChange("education", "year", e.target.value, index)}
                      placeholder="Graduation year"
                    />
                  </div>
                  <div>
                    <Label>GPA/Percentage</Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) => handleInputChange("education", "gpa", e.target.value, index)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addSection("education")}>
              Add Education
            </Button>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange("", "skills", e.target.value)}
                placeholder="List your skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                rows={4}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Projects</h3>
              {formData.projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 mb-4">
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => handleInputChange("projects", "name", e.target.value, index)}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => handleInputChange("projects", "description", e.target.value, index)}
                      placeholder="Describe the project..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Technologies Used</Label>
                    <Input
                      value={project.technologies}
                      onChange={(e) => handleInputChange("projects", "technologies", e.target.value, index)}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => addSection("projects")}>
                Add Project
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;
