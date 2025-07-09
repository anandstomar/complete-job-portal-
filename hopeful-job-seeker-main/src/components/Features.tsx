
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, Search, Brain, Users, Trophy } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "AI Resume Builder",
      description: "Create professional resumes with AI-powered summaries and multiple templates",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Smart Cover Letters",
      description: "Generate personalized cover letters for every job application",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Search,
      title: "Job Matching",
      description: "Find jobs that match your skills, experience, and preferences",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Brain,
      title: "Interview Prep",
      description: "Practice with AI-generated questions tailored to your field",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "1-on-1 Mentoring",
      description: "Book sessions with industry experts for personalized guidance",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Track your job search progress with achievements and leaderboards",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Your 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dream Career</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From complete beginners to experienced professionals, our AI-powered platform 
            guides you through every step of your job search journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
