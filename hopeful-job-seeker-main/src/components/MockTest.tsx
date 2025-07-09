import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { listMyTests, submitTest } from "../lib/api";

interface MockTestProps {
  onBack: () => void;
  candidateId: string;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: number;
  category: string;
}

interface AssignedTest {
  _id: string;
  test: {
    _id: string;
    title: string;
    questions: Question[];
    category?: string;
  };
  status: string;
  score?: number;
  completedAt?: string;
}

const MockTest = ({ onBack, candidateId }: MockTestProps) => {
  const { toast } = useToast();
  const [assignedTests, setAssignedTests] = useState<AssignedTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<AssignedTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    listMyTests(candidateId)
      .then(res => {
        setAssignedTests(res.data.filter((t: AssignedTest) => t.status !== "Completed"));
        setLoading(false);
      })
      .catch(() => {
        setAssignedTests([]);
        setLoading(false);
      });
  }, [candidateId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && !testCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted) {
      completeTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    if (!selectedTest) return;
    setTestStarted(true);
    setSelectedAnswers(new Array(selectedTest.test.questions.length).fill(-1));
    toast({
      title: "Test Started!",
      description: "You have 5 minutes to complete the test."
    });
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!selectedTest) return;
    if (currentQuestion < selectedTest.test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeTest = async () => {
    if (!selectedTest) return;
    let correctAnswers = 0;
    selectedTest.test.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setTestCompleted(true);
    setSubmitting(true);
    try {
      await submitTest({
        assignedTestId: selectedTest._id,
        answers: selectedAnswers
      });
      toast({
        title: "Test Completed!",
        description: `You scored ${correctAnswers}/${selectedTest.test.questions.length} (${Math.round((correctAnswers / selectedTest.test.questions.length) * 100)}%)`
      });
    } catch (e) {
      toast({ title: "Error submitting test", description: "Please try again." });
    }
    setSubmitting(false);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setTimeLeft(300);
    setTestStarted(false);
    setTestCompleted(false);
    setScore(0);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading assigned tests...</div>;
  }

  if (!selectedTest) {
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
            <h1 className="text-2xl font-bold text-gray-900">Assigned Tests</h1>
            <p className="text-gray-600">Select a test to begin</p>
          </div>
          <div className="p-6">
            {assignedTests.length === 0 ? (
              <div className="text-center text-gray-500">No assigned tests available.</div>
            ) : (
              <div className="space-y-4">
                {assignedTests.map((test) => (
                  test.test ? (
                    <div key={test._id} className="flex items-center justify-between p-4 bg-gray-50 rounded border">
                      <div>
                        <div className="font-semibold">{test.test.title}</div>
                        <div className="text-sm text-gray-600">Category: {test.test.category || 'N/A'}</div>
                      </div>
                      <Button onClick={() => setSelectedTest(test)}>Take Test</Button>
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => { setSelectedTest(null); restartTest(); }} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Assigned Tests</span>
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{selectedTest.test.title}</h1>
            <p className="text-gray-600">Test your knowledge with this assigned test</p>
          </div>
          <div className="p-6 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>• Total Questions: {selectedTest.test.questions.length}</li>
                  <li>• Time Limit: 5 minutes</li>
                  <li>• Each question has 4 options</li>
                  <li>• You can navigate between questions</li>
                  <li>• Click "Submit Test" when you're done</li>
                </ul>
              </div>
              <Button size="lg" onClick={startTest} className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-3">
                Start Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const percentage = selectedTest.test.questions.length > 0 ? Math.round((score / selectedTest.test.questions.length) * 100) : 0;
    const passed = percentage >= 70;
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
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          </div>
          <div className="p-6 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className={`p-8 rounded-lg ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                {passed ? (
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-2">
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <div className="text-4xl font-bold mb-4 text-gray-900">
                  {score}/{selectedTest.test.questions.length}
                </div>
                <div className="text-2xl font-semibold mb-4">
                  {percentage}%
                </div>
                <p className="text-gray-600 mb-6">
                  {passed 
                    ? 'Great job! You passed the test.' 
                    : 'You need 70% to pass. Try again!'}
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={restartTest} disabled={submitting}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Test
                </Button>
                <Button onClick={onBack} disabled={submitting}>
                  Back to Dashboard
                </Button>
              </div>
              {/* Detailed Results */}
              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <h3 className="font-semibold mb-4">Question Review</h3>
                <div className="space-y-3">
                  {selectedTest.test.questions.map((question, index) => (
                    <div key={question._id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">Q{index + 1}: </span>
                        <span className="text-sm">{question.question}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {question.category}
                        </span>
                        {selectedAnswers[index] === question.answer ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTest) return null;
  const currentQ = selectedTest.test.questions[currentQuestion];
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => { setSelectedTest(null); restartTest(); }} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Tests</span>
        </Button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-red-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedTest.test.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {selectedTest.test.questions.length}</p>
            </div>
            <div className="text-sm text-gray-500">
              Category: {currentQ.category}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / selectedTest.test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevQuestion} 
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {currentQuestion === selectedTest.test.questions.length - 1 ? (
                <Button 
                  onClick={completeTest}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  Submit Test
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
