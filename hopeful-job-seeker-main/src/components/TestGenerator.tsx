import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Wand2, Users } from "lucide-react";
import { createTest, listTests, assignTest, listAssignedTests, deleteTest, updateTest, getAllUsers, listMyTests, submitTest } from "../lib/api";
import { GoogleGenAI } from "@google/genai";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface TestGeneratorProps {
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  difficulty: string;
  category: string;
}

interface Test {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
}

const ai = new GoogleGenAI({apiKey:'AIzaSyDG8F_9sg3vSTk5cGp3JqkN4wAz6KldRH4'});

export async function main(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });
  return response;
}

const TestGenerator = ({ onBack }: TestGeneratorProps) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<Partial<Test>>({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: 30,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: "",
    options: ["", "", "", ""],
    answer: 0,
    difficulty: "",
    category: ""
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedTab, setSelectedTab] = useState("create");
  const { toast } = useToast();

  // For dynamic categories
  const defaultCategories = ["React", "JavaScript", "Node.js", "Python", "General"];
  const [categories, setCategories] = useState<string[]>([...defaultCategories]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingTestData, setEditingTestData] = useState<any>(null);
  const [editingQuestions, setEditingQuestions] = useState<any[]>([]);
  const [questionEditStates, setQuestionEditStates] = useState<{[key: string]: boolean}>({});

  const [aiLoading, setAiLoading] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningTest, setAssigningTest] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    // Load existing tests and users from backend
    listTests()
      .then(res => {
        setTests(res.data);
        // Add any categories from tests to categories state
        const testCategories = res.data.map((t: any) => t.category).filter(Boolean);
        setCategories(prev => Array.from(new Set([...prev, ...testCategories])));
      })
      .catch(() => setTests([]));
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleSaveTest = async () => {
    try {
      if (isEditing && editingTestId) {
        await updateTest(editingTestId, currentTest);
        toast({ title: "Test Updated!", description: "Test has been updated." });
      } else {
        await createTest(currentTest);
        toast({ title: "Test Created!", description: "Test has been created." });
      }
      setIsEditing(false);
      setEditingTestId(null);
      setCurrentTest({ title: "", description: "", category: "", difficulty: "", duration: 30, questions: [] });
      listTests().then(res => setTests(res.data));
      setSelectedTab("manage");
    } catch (err) {
      toast({ title: "Error", description: isEditing ? "Failed to update test." : "Failed to create test.", variant: "destructive" });
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options?.some(opt => !opt)) {
      toast({
        title: "Error",
        description: "Please fill in the question and all options.",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: currentQuestion.question!,
      options: currentQuestion.options!,
      answer: currentQuestion.answer!,
      difficulty: currentQuestion.difficulty || currentTest.difficulty || "Medium",
      category: currentQuestion.category || currentTest.category!
    };

    setCurrentTest(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      difficulty: "",
      category: ""
    });

    setIsAddingQuestion(false);
  };

  const handleAIGenerate = async () => {
    if (!currentTest.category) return;
    setAiLoading(true);
    try {
      const prompt = `Generate 2 multiple-choice questions for a coding test in the category '${currentTest.category}'. Each question should have 4 options and specify the correct answer index. Return as a JSON array with fields: question, options (array), answer (index).`;
      const aiResponse = await main(prompt);
      console.log(aiResponse)
      const text = aiResponse.candidates[0].content.parts[0].text;
      const jsonString = text.replace(/```json|```/g, '').trim();
      const questions = JSON.parse(jsonString);
      setCurrentTest(prev => ({
        ...prev,
        questions: [...(prev.questions || []), ...questions.map((q, i) => ({
          id: Date.now().toString() + i,
          ...q,
          answer: q.answer !== undefined ? q.answer : q.correctAnswer,
          difficulty: currentTest.difficulty || "Medium",
          category: currentTest.category
        }))]
      }));
      toast({ title: "AI Questions Generated!", description: `Added ${questions.length} AI-generated questions.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate questions.", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAssignTest = async (testId: string, userId: string) => {
    try {
      await assignTest({ testId, candidateId: userId });
      toast({
        title: "Test Assigned!",
        description: "Test has been assigned to the candidate successfully."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign test.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      await deleteTest(testId);
      toast({ title: "Test Deleted!", description: "Test has been deleted." });
      listTests().then(res => setTests(res.data));
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete test.", variant: "destructive" });
    }
  };

  const handleEditTest = (test: any) => {
    setEditingTestId(test._id || test.id);
    setEditingTestData({ ...test });
    setEditingQuestions(test.questions.map((q: any) => ({ ...q })));
    setQuestionEditStates({});
  };

  const handleCancelEdit = () => {
    setEditingTestId(null);
    setEditingTestData(null);
    setEditingQuestions([]);
    setQuestionEditStates({});
  };

  const handleSaveEdit = async () => {
    if (!editingTestId || !editingTestData) return;
    try {
      await updateTest(editingTestId, { ...editingTestData, questions: editingQuestions });
      toast({ title: "Test Updated!", description: "Test and questions have been updated." });
      setEditingTestId(null);
      setEditingTestData(null);
      setEditingQuestions([]);
      setQuestionEditStates({});
      listTests().then(res => setTests(res.data));
    } catch (err) {
      toast({ title: "Error", description: "Failed to update test.", variant: "destructive" });
    }
  };

  const handleEditQuestion = (idx: number) => {
    setQuestionEditStates(prev => ({ ...prev, [idx]: true }));
  };

  const handleCancelQuestionEdit = (idx: number) => {
    setQuestionEditStates(prev => ({ ...prev, [idx]: false }));
  };

  const handleSaveQuestionEdit = (idx: number) => {
    setQuestionEditStates(prev => ({ ...prev, [idx]: false }));
  };

  // Candidate-side: Assigned tests and test-taking
  const [candidateTab, setCandidateTab] = useState(false);
  const [assignedTests, setAssignedTests] = useState<any[]>([]);
  const [takingTest, setTakingTest] = useState<any>(null);
  const [candidateAnswers, setCandidateAnswers] = useState<number[]>([]);
  useEffect(() => {
    if (candidateTab) {
      listMyTests().then(res => setAssignedTests(res.data)).catch(() => setAssignedTests([]));
    }
  }, [candidateTab]);
  const handleStartTest = (assignedTest: any) => {
    setTakingTest(assignedTest);
    setCandidateAnswers(Array(assignedTest.test.questions.length).fill(-1));
  };
  const handleSubmitTest = async () => {
    try {
      await submitTest({ assignedTestId: takingTest._id, answers: candidateAnswers });
      toast({ title: "Test Submitted!", description: "Your test has been submitted." });
      setTakingTest(null);
      listMyTests().then(res => setAssignedTests(res.data));
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit test.", variant: "destructive" });
    }
  };

  const openAssignModal = (test: any) => {
    setAssigningTest(test);
    setAssignModalOpen(true);
    setSelectedUsers([]);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setAssigningTest(null);
    setSelectedUsers([]);
  };

  const handleUserCheckbox = (userId: string) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleAssignSelected = async () => {
    if (!assigningTest || selectedUsers.length === 0) return;
    setAssigning(true);
    try {
      await Promise.all(selectedUsers.map(userId => assignTest({ testId: assigningTest._id || assigningTest.id, candidateId: userId })));
      toast({ title: "Test Assigned!", description: `Test assigned to ${selectedUsers.length} user(s).` });
      closeAssignModal();
    } catch (err) {
      toast({ title: "Error", description: "Failed to assign test.", variant: "destructive" });
    } finally {
      setAssigning(false);
    }
  };

  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (!cat || categories.includes(cat)) return;
    setCategories(prev => [...prev, cat]);
    setNewCategory("");
    setCurrentTest(prev => ({ ...prev, category: cat }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Test Generator</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={selectedTab === "create" ? "default" : "outline"}
          onClick={() => setSelectedTab("create")}
        >
          Create Test
        </Button>
        <Button
          variant={selectedTab === "manage" ? "default" : "outline"}
          onClick={() => setSelectedTab("manage")}
        >
          Manage Tests
        </Button>
        <Button
          variant={selectedTab === "assign" ? "default" : "outline"}
          onClick={() => setSelectedTab("assign")}
        >
          Assign Tests
        </Button>
      </div>

      {selectedTab === "create" && (
        <div className="space-y-6">
          {/* Test Details */}
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Test Title</Label>
                  <Input
                    id="title"
                    value={currentTest.title}
                    onChange={(e) => setCurrentTest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter test title"
                  />
                </div>
                <div className="flex flex-row items-end gap-2 w-full">
                  <div className="flex-1">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={currentTest.category || ''}
                      onValueChange={value => setCurrentTest(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-row items-end gap-2 pb-0">
                    <div>
                      <Label className="invisible">Add</Label>
                      <Input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        placeholder="Add category"
                        className="w-32"
                      />
                    </div>
                    <div>
                      <Label className="invisible">Plus</Label>
                      <Button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 text-lg font-bold h-10 w-10 flex items-center justify-center"
                        style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select onValueChange={(value) => setCurrentTest(prev => ({ ...prev, difficulty: value }))} value={currentTest.difficulty || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={currentTest.duration}
                    onChange={(e) => setCurrentTest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentTest.description}
                  onChange={(e) => setCurrentTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter test description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({currentTest.questions?.length || 0})</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleAIGenerate}
                    className="flex items-center space-x-2"
                    disabled={!currentTest.category || aiLoading}
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{aiLoading ? "Generating..." : "AI Generate"}</span>
                  </Button>
                  <Button
                    onClick={() => setIsAddingQuestion(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentTest.questions?.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Q{index + 1}: {question.question}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentTest(prev => ({
                          ...prev,
                          questions: prev.questions?.filter(q => q.id !== question.id)
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 text-sm rounded ${
                          optIndex === question.answer ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary">{question.difficulty}</Badge>
                </div>
              ))}

              {isAddingQuestion && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index}>
                          <Label>Option {String.fromCharCode(65 + index)}</Label>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || ["", "", "", ""])];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>Correct Answer</Label>
                      <Select onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, answer: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">A</SelectItem>
                          <SelectItem value="1">B</SelectItem>
                          <SelectItem value="2">C</SelectItem>
                          <SelectItem value="3">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddQuestion}>Add Question</Button>
                      <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSaveTest} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Test</span>
          </Button>
        </div>
      )}

      {selectedTab === "manage" && (
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test._id || test.id}>
              <CardContent className="p-6">
                {editingTestId === (test._id || test.id) ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{editingTestData.title}</h3>
                    <div className="mb-4">
                      {editingQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="border rounded-lg p-4 mb-4 bg-gray-50">
                          {questionEditStates[idx] ? (
                            <div>
                              <Input
                                className="mb-2"
                                value={q.question}
                                onChange={e => setEditingQuestions(questions => questions.map((qq, i) => i === idx ? { ...qq, question: e.target.value } : qq))}
                                placeholder="Question text"
                              />
                              {q.options.map((opt: string, oidx: number) => (
                                <Input
                                  key={oidx}
                                  className="mb-2"
                                  value={opt}
                                  onChange={e => setEditingQuestions(questions => questions.map((qq, i) => i === idx ? { ...qq, options: qq.options.map((oo: string, oi: number) => oi === oidx ? e.target.value : oo) } : qq))}
                                  placeholder={`Option ${String.fromCharCode(65 + oidx)}`}
                                />
                              ))}
                              <div className="mb-2">
                                <Label>Correct Answer</Label>
                                <select
                                  value={q.answer}
                                  onChange={e => setEditingQuestions(questions => questions.map((qq, i) => i === idx ? { ...qq, answer: parseInt(e.target.value) } : qq))}
                                >
                                  {q.options.map((_, oidx: number) => (
                                    <option key={oidx} value={oidx}>{String.fromCharCode(65 + oidx)}</option>
                                  ))}
                                </select>
                              </div>
                              <Input
                                className="mb-2"
                                value={q.difficulty}
                                onChange={e => setEditingQuestions(questions => questions.map((qq, i) => i === idx ? { ...qq, difficulty: e.target.value } : qq))}
                                placeholder="Difficulty"
                              />
                              <Input
                                className="mb-2"
                                value={q.category}
                                onChange={e => setEditingQuestions(questions => questions.map((qq, i) => i === idx ? { ...qq, category: e.target.value } : qq))}
                                placeholder="Category"
                              />
                              <div className="flex space-x-2 mt-2">
                                <Button size="sm" onClick={() => handleSaveQuestionEdit(idx)}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => handleCancelQuestionEdit(idx)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">Q{idx + 1}: {q.question}</h4>
                                <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(idx)}>Edit</Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {q.options.map((option: string, optIndex: number) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 text-sm rounded ${optIndex === q.answer ? 'bg-green-100' : 'bg-gray-100'}`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </div>
                                ))}
                              </div>
                              <Badge variant="secondary">{q.difficulty}</Badge>
                              <Badge variant="outline" className="ml-2">{q.category}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save All</Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{test.title}</h3>
                      <p className="text-gray-600">{test.description}</p>
                      <div className="flex space-x-2 mt-2">
                        <Badge>{test.category}</Badge>
                        <Badge variant="outline">{test.difficulty}</Badge>
                        <Badge variant="secondary">{test.questions.length} questions</Badge>
                        <Badge variant="outline">{test.duration} min</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTest(test)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTest(test._id || test.id)}>Delete</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === "assign" && (
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test._id || test.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{test.title}</h3>
                    <p className="text-sm text-gray-600">{test.category} • {test.difficulty}</p>
                  </div>
                  <Button onClick={() => openAssignModal(test)}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Test: {assigningTest?.title}</DialogTitle>
              </DialogHeader>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search user by name or email..."
                className="mb-3"
              />
              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {users
                  .filter(user => user.role !== "admin")
                  .filter(user => {
                    if (!searchTerm.trim()) return true;
                    const term = searchTerm.toLowerCase();
                    return (
                      (user.fullName && user.fullName.toLowerCase().includes(term)) ||
                      (user.email && user.email.toLowerCase().includes(term))
                    );
                  })
                  .map(user => (
                    <div key={user._id || user.id} className="flex items-center space-x-3 p-2 border rounded">
                      <Checkbox checked={selectedUsers.includes(user._id || user.id)} onCheckedChange={() => handleUserCheckbox(user._id || user.id)} />
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <DialogFooter>
                <Button onClick={handleAssignSelected} disabled={assigning || selectedUsers.length === 0}>{assigning ? "Assigning..." : "Assign Selected"}</Button>
                <Button variant="outline" onClick={closeAssignModal} disabled={assigning}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {candidateTab && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">My Assigned Tests</h2>
          {takingTest ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{takingTest.test.title}</h3>
                <p className="mb-4 text-gray-600">{takingTest.test.description}</p>
                {takingTest.test.questions.map((q, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="font-medium mb-2">Q{idx + 1}: {q.question}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt: string, oidx: number) => (
                        <Button
                          key={oidx}
                          variant={candidateAnswers[idx] === oidx ? "default" : "outline"}
                          onClick={() => setCandidateAnswers(ans => ans.map((a, i) => i === idx ? oidx : a))}
                        >
                          {String.fromCharCode(65 + oidx)}. {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button onClick={handleSubmitTest} className="mt-4">Submit Test</Button>
                <Button variant="outline" className="mt-4 ml-2" onClick={() => setTakingTest(null)}>Cancel</Button>
              </CardContent>
            </Card>
          ) : (
            assignedTests.length === 0 ? (
              <div className="text-gray-500">No assigned tests.</div>
            ) : (
              assignedTests.map((assigned) => (
                <Card key={assigned._id}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{assigned.test.title}</h3>
                      <p className="text-sm text-gray-600">{assigned.test.category} • {assigned.test.difficulty}</p>
                      <p className="text-xs text-gray-500">Status: {assigned.status}</p>
                    </div>
                    {assigned.status === "Assigned" && (
                      <Button onClick={() => handleStartTest(assigned)}>Take Test</Button>
                    )}
                    {assigned.status === "Completed" && (
                      <span className="text-green-600 font-semibold">Completed</span>
                    )}
                  </CardContent>
                </Card>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TestGenerator;
