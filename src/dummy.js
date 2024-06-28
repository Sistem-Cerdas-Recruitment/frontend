/* eslint-disable prettier/prettier */
import { majors } from "utils/enums/majors";
import { cities } from "utils/enums/cities";
const oneDay = 86400000;
const dJob = {

  id: 1, // id
  // img: team1, // string
  title: "Frontend Developer UX", // string
  company: "PT. Sejahtera Bahagia Selamanya PASTI", // string
  location: "Bandung", // string
  salary: [1000000, 5000000], // array integer (monthly salary range)
  
  mode: "Remote", // ["Remote", "Hybrid", "On-site"];
  type: "Full-time", // ["Internship", "Full-time", "Part-time", "Contract"];
  experienceLevel: "Mid Level", // ["Internship", "Junior Level", "Associate", "Mid Level", "Senior Level", "Lead Level"]
  
  // Extract by separator on existing description, separator is object.attribute name
  description: "Build web applications using ReactJS",
  advantages: ["Advantage 1", "Advantage 2", "Advantage 3"],
  additionalInfo: "Additional Information",

  // Select from existing majors
  majors: [majors[0], majors[1], majors[2]], // array string

  // Extract by separator on existing skills
  minYearExperience: 2, // integer
  requirements: ["Requirement 1", "Requirement 2", "Requirement 3"],
  responsibilities: ["Responsibility 1", "Responsibility 2", "Responsibility 3"],

  candidatesApplied: 10, // integer
  interviewOffered: 5, // integer
  interviewed: 2, // integer
  interviewResult: 1, // integer
  status: true, // boolean

  createdAt: new Date(Date.now() - 2 * oneDay), // date -> kebutuhan filter [ "Any time", "Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days", "Last 30 days"];
  updatedAt: new Date(Date.now()), // date
  closedAt: null, // date
};

const dJobs = Array.from({ length: 3 }, (_, i) => {
  return {
    ...dJob,
    id: i + 1,
    createdAt: Date.now() - (i+2) * oneDay,
    updatedAt: new Date(Date.now() + -i * oneDay), // date
    closedAt: null, // date
  };
});
// djobs add djob 30 days and djob 60 days
dJobs.push({
  ...dJob,
  id: 15,
  status: false,
  createdAt: Date.now() - 30 * oneDay,
  updatedAt: new Date(Date.now() + (2-30) * oneDay), // date
  closedAt: new Date (Date.now() + (7-30) * oneDay), // date
});
dJobs.push({
  ...dJob,
  id: 16,
  createdAt: Date.now() - 60 * oneDay,
  updatedAt: new Date(Date.now() - 60 * oneDay), // date
});

const user = {
  name: "John Doe",
  email: "c@gmail.com",
  location: cities[0],
  major: majors[0],
}

const apps = [
  {
      "id": "76f1a8a8-09b5-4c39-8a4f-7bc34697714b",
      "status": "INTERVIEW",
      "jobId": "5f52082b-1a23-4a5e-9d64-407529ea172e",
      "jobTitle": "Job 1",
      "recruiterId": "f8494133-c3d8-424b-b6ac-000f81577db5",
      "recruiterName": "Rahmat",
      "userId": "21936608-d7da-4b77-8636-90908b1cd022",
      "userName": "Aldwin"
  }
]

export { dJobs, user, apps };
