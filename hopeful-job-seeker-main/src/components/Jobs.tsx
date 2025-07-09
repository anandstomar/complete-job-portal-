import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";
import { getAllJobs, applyToJob, getUserApplications } from "../lib/api";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: { min: number; max: number };
  experience: { min: number; max: number };
  description: string;
  requirements: string[];
  postedBy: string;
  applicants: string[];
  createdAt: string;
}

interface JobsProps {
  onBack: () => void;
}

const Jobs = ({ onBack }: JobsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    // Fetch jobs from backend
    getAllJobs().then(res => setJobs(res.data)).catch(() => setJobs([]));
    // Fetch user's applied jobs from backend
    getUserApplications().then(res => setAppliedJobIds(res.data.map((job: Job) => job._id))).catch(() => setAppliedJobIds([]));
  }, []);

  const checkEligibility = () => {
    // You may want to check eligibility from props or context, or pass as a prop
    // For now, always allow (since dashboard already restricts access)
    return true;
  };

  const handleApply = async (jobId: string) => {
    if (!checkEligibility()) {
      toast({
        title: "Not Eligible",
        description: "You need to pass a mock test with at least 75% score to apply for jobs.",
        variant: "destructive"
      });
      return;
    }
    try {
      await applyToJob(jobId, {});
      setAppliedJobIds(prev => [...prev, jobId]);
      toast({
        title: "Application Successful! 🎉",
        description: "You have applied to this job.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to apply to job.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary?.min && job.salary?.max ? `₹${job.salary.min} - ₹${job.salary.max}` : "Negotiable"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={`${req}-${index}`} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge key="more" variant="outline" className="text-xs">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleApply(job._id)}
                    disabled={appliedJobIds.includes(job._id)}
                  >
                    {appliedJobIds.includes(job._id) ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
