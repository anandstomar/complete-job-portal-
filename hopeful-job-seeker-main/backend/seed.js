// seed.js
import mongoose from 'mongoose';
// Import your Mongoose models
import Interview from './models/interviewSchema.js';
// import Application from './models/jobApplicationSchema.js';
// import JobSchema from './models/UserJobSchema.js';

// Destructure ObjectId from mongoose.Types
const { Types: { ObjectId } } = mongoose;

async function main() {
  // 1) Connect to MongoDB
  await mongoose.connect(
    'mongodb+srv://user:TxHeTiXPMHdmAxBp@cluster0.tmfdszp.mongodb.net/test?retryWrites=true&w=majority'
  );

  // await JobSchema.deleteMany({});
  // await Application.deleteMany({});
  await Interview.deleteMany({});

  // 2) Seed 5 Jobs
  // await JobSchema.insertMany([
  //   { _id: new ObjectId('60f71a1b2f8fb814c8e4d001'), title: 'Frontend Engineer', company: 'Acme Corp', location: 'Bengaluru, India', type: 'Full-time', salary: { min: 50000, max: 80000 }, experience: { min: 2, max: 5 }, description: 'Build and maintain React applications.', requirements: ['React','JS','HTML/CSS'], postedBy: new ObjectId('6866508feb799a39c3d72314'), applicants: [new ObjectId('68594177b8815eaf718d2193')], createdAt: new Date('2025-06-20T09:00:00Z'), updatedAt: new Date('2025-06-20T09:00:00Z') },
  //   { _id: new ObjectId('60f71a1b2f8fb814c8e4d002'), title: 'Backend Engineer', company: 'Tech Solutions Pvt Ltd', location: 'Hyderabad, India', type: 'Full-time', salary: { min: 60000, max: 90000 }, experience: { min: 3, max: 7 }, description: 'Design RESTful APIs and microservices.', requirements: ['Node.js','Express','MongoDB'], postedBy: new ObjectId('6866508feb799a39c3d72314'), applicants: [new ObjectId('685943be2634fa66f2cc34d3')], createdAt: new Date('2025-06-22T10:00:00Z'), updatedAt: new Date('2025-06-22T10:00:00Z') },
  //   { _id: new ObjectId('60f71a1b2f8fb814c8e4d003'), title: 'Data Scientist', company: 'Insight Analytics', location: 'Delhi, India', type: 'Contract', salary: { min: 70000, max: 120000 }, experience: { min: 2, max: 5 }, description: 'Build predictive models and analyze datasets.', requirements: ['Python','TensorFlow','Pandas'], postedBy: new ObjectId('6859474fb06d603b9f0c22f0'), applicants: [new ObjectId('68594177b8815eaf718d2193')], createdAt: new Date('2025-06-23T11:15:00Z'), updatedAt: new Date('2025-06-23T11:15:00Z') },
  //   { _id: new ObjectId('60f71a1b2f8fb814c8e4d004'), title: 'DevOps Engineer', company: 'CloudOps Inc.', location: 'Mumbai, India', type: 'Full-time', salary: { min: 65000, max: 100000 }, experience: { min: 3, max: 6 }, description: 'Manage CI/CD pipelines and cloud infrastructure.', requirements: ['Docker','Kubernetes','AWS'], postedBy: new ObjectId('6866508feb799a39c3d72314'), applicants: [new ObjectId('685943be2634fa66f2cc34d3')], createdAt: new Date('2025-06-24T12:00:00Z'), updatedAt: new Date('2025-06-24T12:00:00Z') },
  //   { _id: new ObjectId('60f71a1b2f8fb814c8e4d005'), title: 'UI/UX Designer', company: 'DesignWorks', location: 'Pune, India', type: 'Contract', salary: { min: 40000, max: 70000 }, experience: { min: 1, max: 3 }, description: 'Design user interfaces and experiences.', requirements: ['Figma','Sketch','Adobe XD'], postedBy: new ObjectId('6859474fb06d603b9f0c22f0'), applicants: [new ObjectId('68594177b8815eaf718d2193')], createdAt: new Date('2025-06-25T09:30:00Z'), updatedAt: new Date('2025-06-25T09:30:00Z') }
  // ]);

  // // 3) Seed 5 Applications
  // await Application.insertMany([
  //   { _id: new ObjectId('60f71b2c2f8fb814c8e4d010'), applicantName: 'John Doe', applicantEmail: 'user@jobportal.com', applicantPhone: '+91-9876543210', applicantLocation: 'Mumbai, India', jobTitle: 'Frontend Engineer', company: 'Acme Corp', appliedDate: new Date('2025-06-21T15:30:00Z'), currentStatus: 'Interview Scheduled', history:[{status:'New',date:new Date('2025-06-21T15:30:00Z')},{status:'Interview Scheduled',date:new Date('2025-06-22T10:00:00Z')}], experience:'3 years in React', skills:['React','TypeScript'], bio:'Frontend expert.', resumeUrl:'https://...', coverLetter:'Excited to join.', createdAt:new Date('2025-06-21T15:30:00Z'), updatedAt:new Date('2025-06-22T10:00:00Z')},
  //   { _id: new ObjectId('60f71b2c2f8fb814c8e4d011'), applicantName: 'Jane Smith', applicantEmail: 'jane@jobportal.com', applicantPhone: '+91-9123456780', applicantLocation: 'Chennai, India', jobTitle: 'Backend Engineer', company: 'Tech Solutions Pvt Ltd', appliedDate: new Date('2025-06-24T09:45:00Z'), currentStatus: 'Under Review', history:[{status:'New',date:new Date('2025-06-24T09:45:00Z')},{status:'Under Review',date:new Date('2025-06-25T14:00:00Z')}], experience:'4 years in Node.js', skills:['Node.js','Docker'], bio:'Backend specialist.', resumeUrl:'https://...', coverLetter:'Looking forward.', createdAt:new Date('2025-06-24T09:45:00Z'), updatedAt:new Date('2025-06-25T14:00:00Z')},
  //   { _id: new ObjectId('60f71b2c2f8fb814c8e4d012'), applicantName: 'Bob Lee', applicantEmail: 'bob@jobportal.com', applicantPhone: '+91-9988776655', applicantLocation: 'Delhi, India', jobTitle: 'Data Scientist', company: 'Insight Analytics', appliedDate: new Date('2025-06-23T16:20:00Z'), currentStatus: 'Interview Scheduled', history:[{status:'New',date:new Date('2025-06-23T16:20:00Z')},{status:'Interview Scheduled',date:new Date('2025-06-24T10:30:00Z')}], experience:'3 years in ML', skills:['Python','Pandas'], bio:'Data enthusiast.', resumeUrl:'https://...', coverLetter:'Thrilled to apply.', createdAt:new Date('2025-06-23T16:20:00Z'), updatedAt:new Date('2025-06-24T10:30:00Z')},
  //   { _id: new ObjectId('60f71b2c2f8fb814c8e4d013'), applicantName: 'Alice Wong', applicantEmail: 'alice@jobportal.com', applicantPhone: '+91-9234567890', applicantLocation: 'Bengaluru, India', jobTitle: 'DevOps Engineer', company: 'CloudOps Inc.', appliedDate: new Date('2025-06-24T12:10:00Z'), currentStatus: 'Under Review', history:[{status:'New',date:new Date('2025-06-24T12:10:00Z')},{status:'Under Review',date:new Date('2025-06-25T09:00:00Z')}], experience:'2 years in DevOps', skills:['AWS','Kubernetes'], bio:'DevOps enthusiast.', resumeUrl:'https://...', coverLetter:'Ready to help ops.', createdAt:new Date('2025-06-24T12:10:00Z'), updatedAt:new Date('2025-06-25T09:00:00Z')},
  //   { _id: new ObjectId('60f71b2c2f8fb814c8e4d014'), applicantName: 'Eve Torres', applicantEmail: 'eve@jobportal.com', applicantPhone: '+91-9871122334', applicantLocation: 'Pune, India', jobTitle: 'UI/UX Designer', company: 'DesignWorks', appliedDate: new Date('2025-06-25T14:00:00Z'), currentStatus: 'New', history:[{status:'New',date:new Date('2025-06-25T14:00:00Z')}], experience:'1 year designing', skills:['Figma','Sketch'], bio:'Design lover.', resumeUrl:'https://...', coverLetter:'Design excites me.', createdAt:new Date('2025-06-25T14:00:00Z'), updatedAt:new Date('2025-06-25T14:00:00Z')}
  // ]);

 

  // // 4) Seed 5 Interviews
  // await Interview.insertMany([
  //   { _id: new ObjectId('60f71c3d2f8fb814c8e4d020'), candidate:new ObjectId('68594177b8815eaf718d2193'), interviewer:new ObjectId('6859474fb06d603b9f0c22f0'), job:new ObjectId('60f71a1b2f8fb814c8e4d001'), application:new ObjectId('60f71b2c2f8fb814c8e4d010'), scheduledAt:new Date('2025-07-10T09:30:00Z'), type:'Video Call', duration:60, status:'Scheduled', history:[{status:'Scheduled',date:new Date('2025-06-22T10:05:00Z')}], outcome:'Pending', notes:'', feedback:'', interviewerName:'Jane Doe5', createdAt:new Date('2025-06-22T10:05:00Z'), updatedAt:new Date('2025-06-22T10:05:00Z')},
  //   { _id: new ObjectId('60f71c3d2f8fb814c8e4d021'), candidate:new ObjectId('685943be2634fa66f2cc34d3'), interviewer:new ObjectId('6866508feb799a39c3d72314'), job:new ObjectId('60f71a1b2f8fb814c8e4d002'), application:new ObjectId('60f71b2c2f8fb814c8e4d011'), scheduledAt:new Date('2025-07-12T14:00:00Z'), type:'Phone Call', duration:30, status:'In Progress', history:[{status:'In Progress',date:new Date('2025-07-12T14:00:00Z')}], outcome:'Pending', notes:'', feedback:'', interviewerName:'Anand Singh Tomar', createdAt:new Date('2025-06-25T14:05:00Z'), updatedAt:new Date('2025-07-12T14:30:00Z')},
  //   { _id: new ObjectId('60f71c3d2f8fb814c8e4d022'), candidate:new ObjectId('68594177b8815eaf718d2193'), interviewer:new ObjectId('6859474fb06d603b9f0c22f0'), job:new ObjectId('60f71a1b2f8fb814c8e4d003'), application:new ObjectId('60f71b2c2f8fb814c8e4d012'), scheduledAt:new Date('2025-07-15T11:00:00Z'), type:'In-Person', duration:90, status:'Completed', history:[{status:'Completed',date:new Date('2025-07-15T12:30:00Z')}], outcome:'Passed', notes:'Great skills', feedback:'Excellent', interviewerName:'Jane Doe5', createdAt:new Date('2025-06-24T10:35:00Z'), updatedAt:new Date('2025-07-15T12:45:00Z')},
  //   { _id: new ObjectId('60f71c3d2f8fb814c8e4d023'), candidate:new ObjectId('685943be2634fa66f2cc34d3'), interviewer:new ObjectId('6866508feb799a39c3d72314'), job:new ObjectId('60f71a1b2f8fb814c8e4d003'), application:new ObjectId('60f71b2c2f8fb814c8e4d013'), scheduledAt:new Date('2025-07-18T16:30:00Z'), type:'Video Call', duration:45, status:'Cancelled', history:[{status:'Cancelled',date:new Date('2025-07-17T08:00:00Z')}], outcome:'On Hold', notes:'Reschedule requested', feedback:'', interviewerName:'Anand Singh Tomar', createdAt:new Date('2025-06-25T09:05:00Z'), updatedAt:new Date('2025-07-17T08:00:00Z')},
  //   { _id: new ObjectId('60f71c3d2f8fb814c8e4d024'), candidate:new ObjectId('68594177b8815eaf718d2193'), interviewer:new ObjectId('6866508feb799a39c3d72314'), job:new ObjectId('60f71a1b2f8fb814c8e4d004'), application:new ObjectId('60f71b2c2f8fb814c8e4d014'), scheduledAt:new Date('2025-07-20T10:00:00Z'), type:'In-Person', duration:60, status:'Scheduled', history:[{status:'Scheduled',date:new Date('2025-06-26T09:00:00Z')}], outcome:'Pending', notes:'', feedback:'', interviewerName:'Anand Singh Tomar', createdAt:new Date('2025-06-26T09:00:00Z'), updatedAt:new Date('2025-06-26T09:00:00Z')}  
  // ]);

  // In your seed script or mongo shell with Mongoose/types:
await Interview.insertMany([
  {
    _id: new ObjectId('60f71c3d2f8fb814c8e4d020'),
    candidate: new ObjectId('6866609abf12c23f4d8e1234'),      // Priya Patel
    interviewer: new ObjectId('6866609abf12c23f4d8e1235'),    // Rahul Sharma
    job: new ObjectId('60f71a1b2f8fb814c8e4d001'),            // Frontend Engineer
    application: new ObjectId('60f71b2c2f8fb814c8e4d010'),    // John Doe’s FE app
    scheduledAt: new Date('2025-07-10T11:30:00Z'),
    type: 'Video Call',
    duration: 60,
    status: 'Scheduled',
    history: [
      { status: 'Scheduled', date: new Date('2025-06-21T09:05:00Z') }
    ],
    outcome: 'Pending',
    notes: '',
    feedback: '',
    interviewerName: 'Rahul Sharma',
    createdAt: new Date('2025-06-21T09:05:00Z'),
    updatedAt: new Date('2025-06-21T09:05:00Z')
  },
  {
    _id: new ObjectId('60f71c3d2f8fb814c8e4d021'),
    candidate: new ObjectId('6866609abf12c23f4d8e1236'),      // Sneha Gupta
    interviewer: new ObjectId('6866609abf12c23f4d8e1237'),    // Vikram Rao
    job: new ObjectId('60f71a1b2f8fb814c8e4d002'),            // Backend Engineer
    application: new ObjectId('60f71b2c2f8fb814c8e4d011'),    // Jane Smith’s BE app
    scheduledAt: new Date('2025-07-11T12:30:00Z'),
    type: 'Phone Call',
    duration: 30,
    status: 'Completed',
    history: [
      { status: 'Scheduled', date: new Date('2025-06-25T09:45:00Z') },
      { status: 'Completed', date: new Date('2025-07-11T12:30:00Z'), notes: 'Good technical skills' }
    ],
    outcome: 'Passed',
    notes: 'Strong backend fundamentals',
    feedback: 'Recommended for next round',
    interviewerName: 'Vikram Rao',
    createdAt: new Date('2025-06-25T09:45:00Z'),
    updatedAt: new Date('2025-07-11T12:30:00Z')
  },
  {
    _id: new ObjectId('60f71c3d2f8fb814c8e4d022'),
    candidate: new ObjectId('6866609abf12c23f4d8e1234'),      // Priya Patel
    interviewer: new ObjectId('6866508feb799a39c3d72314'),    // Anand Singh Tomar
    job: new ObjectId('60f71a1b2f8fb814c8e4d003'),            // Data Scientist
    application: new ObjectId('60f71b2c2f8fb814c8e4d012'),    // Bob Lee’s DS app
    scheduledAt: new Date('2025-07-13T10:00:00Z'),
    type: 'In-Person',
    duration: 90,
    status: 'Cancelled',
    history: [
      { status: 'Scheduled', date: new Date('2025-06-25T12:00:00Z') },
      { status: 'Cancelled', date: new Date('2025-07-01T08:00:00Z'), notes: 'Interviewer unavailable' }
    ],
    outcome: 'On Hold',
    notes: 'Reschedule requested',
    feedback: '',
    interviewerName: 'Anand Singh Tomar',
    createdAt: new Date('2025-06-25T12:00:00Z'),
    updatedAt: new Date('2025-07-01T08:00:00Z')
  },
  {
    _id: new ObjectId('60f71c3d2f8fb814c8e4d023'),
    candidate: new ObjectId('6866609abf12c23f4d8e1237'),      // Vikram Rao
    interviewer: new ObjectId('6866609abf12c23f4d8e1236'),    // Sneha Gupta
    job: new ObjectId('60f71a1b2f8fb814c8e4d004'),            // DevOps Engineer
    application: new ObjectId('60f71b2c2f8fb814c8e4d013'),    // Alice Wong’s DevOps app
    scheduledAt: new Date('2025-07-14T10:00:00Z'),
    type: 'Video Call',
    duration: 45,
    status: 'In Progress',
    history: [
      { status: 'Scheduled', date: new Date('2025-06-26T09:00:00Z') },
      { status: 'In Progress', date: new Date('2025-07-14T10:00:00Z') }
    ],
    outcome: 'Pending',
    notes: '',
    feedback: '',
    interviewerName: 'Sneha Gupta',
    createdAt: new Date('2025-06-26T09:00:00Z'),
    updatedAt: new Date('2025-07-14T10:00:00Z')
  },
  {
    _id: new ObjectId('60f71c3d2f8fb814c8e4d024'),
    candidate: new ObjectId('6866609abf12c23f4d8e1236'),      // Sneha Gupta
    interviewer: new ObjectId('6866508feb799a39c3d72314'),    // Anand Singh Tomar
    job: new ObjectId('60f71a1b2f8fb814c8e4d005'),            // UI/UX Designer
    application: new ObjectId('60f71b2c2f8fb814c8e4d014'),    // Eve Torres’s UI/UX app
    scheduledAt: new Date('2025-07-15T10:00:00Z'),
    type: 'In-Person',
    duration: 60,
    status: 'Completed',
    history: [
      { status: 'Scheduled', date: new Date('2025-06-27T09:00:00Z') },
      { status: 'Completed', date: new Date('2025-07-15T11:00:00Z'), notes: 'Excellent design sense' }
    ],
    outcome: 'Passed',
    notes: 'Strong portfolio',
    feedback: 'Hire recommended',
    interviewerName: 'Anand Singh Tomar',
    createdAt: new Date('2025-06-27T09:00:00Z'),
    updatedAt: new Date('2025-07-15T11:00:00Z')
  }
]);


  console.log('Seeding complete!');

  // 5) Disconnect
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
