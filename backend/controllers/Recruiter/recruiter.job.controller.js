const Job = require("../../models/job.model");
const User = require("../../models/user.model");

/**
 * POST /recruiter/post-job
 * Posts or updates a job under the recruiter's own company.
 */
const PostRecruiterJob = async (req, res) => {
  try {
    const recruiter = req.user;

    if (!recruiter.recruiterProfile?.companyId) {
      return res.status(400).json({ msg: "Please set up your company profile before posting a job!" });
    }

    const { jobTitle, opportunityType, jobDescription, eligibility, salary, howToApply, applicationDeadline, _id } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ msg: "Job title and job description are required." });
    }

    // Update existing job
    if (_id) {
      const existingJob = await Job.findById(_id);
      if (!existingJob) return res.status(404).json({ msg: "Job not found!" });

      // Ensure recruiter owns this job
      if (existingJob.company.toString() !== recruiter.recruiterProfile.companyId.toString()) {
        return res.status(403).json({ msg: "Unauthorized: you can only edit your own jobs." });
      }

      await existingJob.updateOne({
        jobTitle,
        opportunityType,
        jobDescription,
        eligibility,
        salary,
        howToApply,
        applicationDeadline,
      });
      return res.status(200).json({ msg: "Job updated successfully!" });
    }

    // Create new job
    const newJob = new Job({
      jobTitle,
      opportunityType,
      jobDescription,
      eligibility,
      salary,
      howToApply,
      applicationDeadline,
      postedAt: new Date(),
      company: recruiter.recruiterProfile.companyId,
    });
    await newJob.save();
    return res.status(201).json({ msg: "Job posted successfully!", jobId: newJob._id });
  } catch (error) {
    console.log("recruiter.job.controller.js = PostRecruiterJob => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

/**
 * GET /recruiter/jobs
 * Returns all jobs posted by the recruiter's company.
 */
const GetRecruiterJobs = async (req, res) => {
  try {
    const recruiter = req.user;

    if (!recruiter.recruiterProfile?.companyId) {
      return res.status(200).json({ jobs: [] });
    }

    const jobs = await Job.find({ company: recruiter.recruiterProfile.companyId })
      .populate('company', 'companyName companyLocation companyWebsite')
      .sort({ postedAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.log("recruiter.job.controller.js = GetRecruiterJobs => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

/**
 * POST /recruiter/delete-job
 * Deletes a job that belongs to the recruiter's company.
 */
const DeleteRecruiterJob = async (req, res) => {
  try {
    const recruiter = req.user;
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found!" });

    if (job.company.toString() !== recruiter.recruiterProfile.companyId.toString()) {
      return res.status(403).json({ msg: "Unauthorized: you can only delete your own jobs." });
    }

    await job.deleteOne();
    return res.status(200).json({ msg: "Job deleted successfully!" });
  } catch (error) {
    console.log("recruiter.job.controller.js = DeleteRecruiterJob => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { PostRecruiterJob, GetRecruiterJobs, DeleteRecruiterJob };
