import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, User, Video } from "lucide-react";
import { listInterviews, createInterview } from "../lib/api";

interface InterviewSchedulingProps {
  onBack: () => void;
}

const InterviewScheduling = ({ onBack }: InterviewSchedulingProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Optionally fetch mentors from backend if available, else keep as empty array
  const [mentors, setMentors] = useState<any[]>([]); // TODO: Replace with API call if backend supports mentors

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    listInterviews().then(res => setInterviews(res.data)).catch(() => setInterviews([]));
    // Optionally fetch mentors here if backend supports it
  }, []);

  const handleScheduleInterview = async (mentorId: string, mentorName: string) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the interview.",
        variant: "destructive"
      });
      return;
    }
    if (!currentUser) return;
    const newInterview = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      mentorId,
      mentorName,
      date: selectedDate,
      time: selectedTime,
      notes,
      status: "Scheduled",
      meetingLink: `https://meet.jobportal.ai/room/${Date.now()}`,
      scheduledAt: new Date().toISOString()
    };
    try {
      await createInterview(newInterview);
      listInterviews().then(res => setInterviews(res.data));
      toast({
        title: "Interview Scheduled! 📅",
        description: `Your interview with ${mentorName} has been scheduled for ${selectedDate} at ${selectedTime}.`
      });
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to schedule interview.",
        variant: "destructive"
      });
    }
  };

  const userInterviews = interviews.filter(interview => interview.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Interview Scheduling</h1>
        </div>

        {/* Scheduled Interviews */}
        {userInterviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Scheduled Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userInterviews.map((interview, index) => (
                <Card key={interview.id || interview._id || index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Interview with {interview.mentorName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {interview.date}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {interview.time}
                      </div>
                      <div className="flex items-center text-sm">
                        <Video className="w-4 h-4 mr-2" />
                        <a href={interview.meetingLink} className="text-blue-600 hover:underline">
                          Join Meeting
                        </a>
                      </div>
                      {interview.notes && (
                        <p className="text-sm text-gray-600 mt-2">{interview.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Mentors */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Mentors</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mentors.map((mentor, index) => (
              <Card key={mentor.id || mentor._id || index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {mentor.name}
                    </div>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⭐ {mentor.rating}
                    </span>
                  </CardTitle>
                  <p className="text-gray-600">{mentor.expertise}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`date-${mentor.id}`}>Select Date</Label>
                        <Input
                          id={`date-${mentor.id}`}
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`time-${mentor.id}`}>Select Time</Label>
                        <Input
                          id={`time-${mentor.id}`}
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`notes-${mentor.id}`}>Notes (Optional)</Label>
                      <Textarea
                        id={`notes-${mentor.id}`}
                        placeholder="Any specific topics you'd like to discuss..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleScheduleInterview(mentor.id, mentor.name)}
                    >
                      Schedule Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduling;
