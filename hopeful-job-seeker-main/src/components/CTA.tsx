
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center space-x-2 text-white/90">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Built with love for job seekers</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your
            <span className="block">Career Journey?</span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who have found their dream jobs with our AI-powered platform. 
            Your success story starts today! ✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Building Resume
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
            >
              Watch Success Stories
            </Button>
          </div>
          
          <div className="pt-8 text-white/80">
            <p className="text-sm">
              💝 No credit card required • 🚀 Start for free • ⭐ Trusted by 10,000+ users
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
