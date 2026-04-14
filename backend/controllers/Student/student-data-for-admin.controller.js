const User = require("../../models/user.model");
const Job = require("../../models/job.model");


const StudentDataYearBranchWise = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    return res.json({ students });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const NotifyStudentStatus = async (req, res) => {
  try {
    const filteredStudents = await User.find({
      role: 'student',
      'studentProfile.appliedJobs.status': { $in: ['interview', 'hired'] }
    })
      .select('_id first_name last_name studentProfile.year studentProfile.department studentProfile.appliedJobs')
      .lean();

    const studentsWithJobDetails = [];

    for (const student of filteredStudents) {
      // Filter applied jobs with status 'interview' or 'hired'
      const appliedJobs = student.studentProfile.appliedJobs.filter(job => ['interview', 'hired'].includes(job.status));

      // Fetch job details for each jobId in the applied jobs
      const jobDetails = await Job.find({
        _id: { $in: appliedJobs.map(job => job.jobId) } // Match the job IDs
      })
        .populate('company', 'companyName')
        .select('company jobTitle _id') // Select company name and job title
        .lean();

      // Map through filtered applied jobs and add the job details (company and title)
      const jobsWithDetails = appliedJobs.map(job => {
        const jobDetail = jobDetails.find(jd => String(jd._id) === String(job.jobId)); // Match jobId
        return {
          status: job.status,
          companyName: jobDetail?.company?.companyName || 'Unknown Company',
          jobId: jobDetail?._id || 'Unknown JobId',
          jobTitle: jobDetail?.jobTitle || 'Unknown Job Title'
        };
      });

      // Push the student info along with only the filtered job details into the final array
      studentsWithJobDetails.push({
        _id: student._id,
        name: `${student.first_name} ${student.last_name}`,
        year: student.studentProfile.year,
        department: student.studentProfile.department,
        jobs: jobsWithDetails // Only the filtered jobs with status 'interview' or 'hired'
      });
    }

    return res.status(200).json({ studentsWithJobDetails });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}


module.exports = {
  StudentDataYearBranchWise,
  NotifyStudentStatus
};