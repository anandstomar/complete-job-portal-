
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play, RotateCcw, Lightbulb, MessageSquare } from "lucide-react";

interface InterviewPrepProps {
  onBack: () => void;
}

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tips: string[];
  sampleAnswer: string;
}

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: "Tell me about yourself.",
    category: "General",
    difficulty: "Easy",
    tips: [
      "Keep it professional and relevant to the job",
      "Structure: Present → Past → Future",
      "Focus on achievements and skills",
      "Keep it under 2 minutes"
    ],
    sampleAnswer: "I'm a passionate software developer with 2 years of experience in full-stack development. Currently, I'm working on React and Node.js projects, where I've successfully delivered multiple client applications. In my previous role, I improved application performance by 40% through code optimization. I'm excited about this opportunity because it aligns with my goal of working on scalable web applications that impact thousands of users."
  },
  {
    id: 2,
    question: "What are your greatest strengths?",
    category: "General", 
    difficulty: "Easy",
    tips: [
      "Choose strengths relevant to the job",
      "Provide specific examples",
      "Show impact of your strengths",
      "Be authentic"
    ],
    sampleAnswer: "My greatest strength is my problem-solving ability. For example, in my last project, we faced a critical performance issue that was causing user complaints. I systematically analyzed the code, identified the bottleneck in our database queries, and implemented caching that reduced load times by 60%. This not only solved the immediate problem but also improved overall user satisfaction."
  },
  {
    id: 3,
    question: "Why do you want to work here?",
    category: "Company-specific",
    difficulty: "Medium",
    tips: [
      "Research the company thoroughly",
      "Mention specific company values or projects",
      "Connect your goals with company goals",
      "Show genuine interest"
    ],
    sampleAnswer: "I'm impressed by [Company]'s commitment to innovation and its impact on [industry]. Your recent project on [specific project] aligns perfectly with my passion for [relevant area]. I believe my experience in [relevant skills] can contribute to your team's goals, and I'm excited about the opportunity to grow alongside a company that values continuous learning and making a difference."
  },
  {
    id: 4,
    question: "Describe a challenging project you worked on.",
    category: "Technical",
    difficulty: "Medium",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your role and contributions",
      "Highlight problem-solving skills",
      "Quantify results when possible"
    ],
    sampleAnswer: "I led a team to rebuild our company's legacy inventory system. The challenge was migrating data from a 10-year-old system while maintaining 99.9% uptime. I designed a phased migration approach, implemented data validation scripts, and coordinated with stakeholders. We successfully migrated 500,000+ records with zero downtime and reduced processing time by 70%."
  },
  {
    id: 5,
    question: "How do you handle stress and pressure?",
    category: "Behavioral",
    difficulty: "Medium",
    tips: [
      "Show you can work under pressure",
      "Mention specific strategies",
      "Provide a real example",
      "Show self-awareness"
    ],
    sampleAnswer: "I handle stress by staying organized and breaking down complex problems into manageable tasks. During a critical product launch, we discovered a major bug two days before the deadline. I prioritized the issue, communicated clearly with the team about our approach, and worked systematically through the problem. We fixed the bug and launched on time. I also practice regular exercise and time management to maintain balance."
  },
  {
    id: 6,
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    difficulty: "Medium",
    tips: [
      "Show ambition but be realistic",
      "Align with company growth opportunities",
      "Focus on skills and impact, not just titles",
      "Show commitment to growth"
    ],
    sampleAnswer: "In 5 years, I see myself as a senior developer leading innovative projects and mentoring junior developers. I want to deepen my expertise in [relevant technology] and contribute to architectural decisions. I'm also interested in understanding the business side better to bridge the gap between technical and business requirements. This role would be a perfect stepping stone toward those goals."
  },
  {
    id: 7,
    question: "Explain a complex technical concept to a non-technical person.",
    category: "Communication",
    difficulty: "Hard",
    tips: [
      "Use simple analogies",
      "Avoid technical jargon",
      "Check for understanding",
      "Be patient and clear"
    ],
    sampleAnswer: "Think of an API like a waiter in a restaurant. You (the customer) don't go directly to the kitchen to get your food. Instead, you tell the waiter what you want, the waiter takes your order to the kitchen, and then brings back your food. Similarly, an API is like that waiter - it takes requests from one application, gets the needed information from another system, and brings back the response."
  },
  {
    id: 8,
    question: "How do you stay updated with technology trends?",
    category: "Learning",
    difficulty: "Easy",
    tips: [
      "Mention specific resources",
      "Show continuous learning mindset",
      "Include practical application",
      "Demonstrate curiosity"
    ],
    sampleAnswer: "I stay updated through multiple channels: I follow industry blogs like TechCrunch and dev.to, participate in developer communities on Reddit and Stack Overflow, and attend local meetups. I also dedicate time each week to experimenting with new technologies in personal projects. Recently, I learned about serverless architecture and built a small project to understand its practical applications."
  }
];

const InterviewPrep = ({ onBack }: InterviewPrepProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  const currentQ = interviewQuestions[currentQuestion];

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % interviewQuestions.length);
    setShowTips(false);
    setShowAnswer(false);
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + interviewQuestions.length) % interviewQuestions.length);
    setShowTips(false);
    setShowAnswer(false);
  };

  const randomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * interviewQuestions.length);
    setCurrentQuestion(randomIndex);
    setShowTips(false);
    setShowAnswer(false);
    toast({
      title: "Random Question Selected!",
      description: "Practice with this question."
    });
  };

  const startPractice = () => {
    setPracticeMode(true);
    toast({
      title: "Practice Mode Started!",
      description: "Take your time to think and answer out loud."
    });
  };

  const stopPractice = () => {
    setPracticeMode(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={randomQuestion}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Random Question
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Preparation</h1>
              <p className="text-gray-600">Practice common interview questions</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Question {currentQuestion + 1} of {interviewQuestions.length}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentQ.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {currentQ.question}
              </h2>
              
              {!practiceMode && (
                <Button 
                  onClick={startPractice}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice Session
                </Button>
              )}
              
              {practiceMode && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Practice Mode Active</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={stopPractice}>
                      Stop Practice
                    </Button>
                  </div>
                  <p className="text-blue-700 mt-2 text-sm">
                    Take your time to think about this question and practice answering out loud. 
                    When ready, you can view tips and sample answers below.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tips Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span>Tips</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowTips(!showTips)}
                  >
                    {showTips ? 'Hide Tips' : 'Show Tips'}
                  </Button>
                </div>
                
                {showTips && (
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <ul className="space-y-2">
                      {currentQ.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <span className="text-yellow-600 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sample Answer Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span>Sample Answer</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                </div>
                
                {showAnswer && (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {currentQ.sampleAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={prevQuestion}>
              Previous Question
            </Button>
            
            <div className="text-sm text-gray-500">
              Use this as a guide, but make your answers personal and authentic
            </div>
            
            <Button onClick={nextQuestion}>
              Next Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
