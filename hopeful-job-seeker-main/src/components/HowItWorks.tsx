
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, FileText, Search, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your background, skills, and career goals",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      step: "02", 
      title: "Build Your Resume",
      description: "Use our AI-powered resume builder to create a professional resume in minutes",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Search,
      step: "03",
      title: "Find Perfect Jobs",
      description: "Browse jobs matched to your profile and apply with your AI-generated materials",
      color: "from-green-500 to-green-600"
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Land Your Dream Job",
      description: "Prepare for interviews with our AI coach and get hired with confidence",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to transform your job search from overwhelming to organized
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2"></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
