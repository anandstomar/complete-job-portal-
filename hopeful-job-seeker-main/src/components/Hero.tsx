
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Users, FileText } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered Career Support</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Dream Job
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              From resume building to interview prep, we're here to guide freshers and experienced professionals 
              toward their perfect career match. Let AI be your personal career coach! ❤️
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Building Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 rounded-xl border-2 hover:bg-gray-50"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">50,000+ Resumes Created</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-blue-100 rounded w-full"></div>
                  <div className="h-3 bg-blue-100 rounded w-4/5"></div>
                  <div className="h-3 bg-blue-100 rounded w-3/5"></div>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                AI-Generated ✨
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg">
              <div className="text-sm font-medium">Resume Score</div>
              <div className="text-2xl font-bold">92%</div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-20">
          <ArrowDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
