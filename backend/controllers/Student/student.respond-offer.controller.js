const User = require('../../models/user.model');
const JobSchema = require('../../models/job.model');

const RespondToOffer = async (req, res) => {
  try {
    const { jobId, action } = req.body;
    const studentId = req.user.id;

    if (!jobId || !action) {
      return res.status(400).json({ msg: 'Job ID and action are required' });
    }

    if (action !== 'accept' && action !== 'decline') {
      return res.status(400).json({ msg: 'Invalid action. Must be accept or decline.' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const job = await JobSchema.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Verify student is actually hired for this job
    const appliedJob = student.studentProfile.appliedJobs.find(app => app.jobId.toString() === jobId);
    if (!appliedJob || appliedJob.status !== 'hired') {
      return res.status(400).json({ msg: 'You do not have a pending offer for this job.' });
    }

    if (action === 'accept') {
      // 1. Update this job's status to offer_accepted in User model
      appliedJob.status = 'offer_accepted';

      // 2. Decline all other 'hired' offers
      student.studentProfile.appliedJobs.forEach(app => {
        if (app.jobId.toString() !== jobId && app.status === 'hired') {
          app.status = 'offer_declined';
        }
      });

      // 3. Update Job model for this accepted offer
      const jobApplicant = job.applicants.find(app => app.studentId.toString() === studentId);
      if (jobApplicant) {
        jobApplicant.status = 'offer_accepted';
      }

      // 4. Update Job models for declined offers
      const otherHiredJobIds = student.studentProfile.appliedJobs
        .filter(app => app.jobId.toString() !== jobId && app.status === 'offer_declined')
        .map(app => app.jobId);

      for (const otherJobId of otherHiredJobIds) {
        const otherJob = await JobSchema.findById(otherJobId);
        if (otherJob) {
          const otherApp = otherJob.applicants.find(a => a.studentId.toString() === studentId);
          if (otherApp) {
            otherApp.status = 'offer_declined';
          }
          await otherJob.save();
        }
      }

    } else if (action === 'decline') {
      // Update this job's status to offer_declined in User and Job models
      appliedJob.status = 'offer_declined';
      
      const jobApplicant = job.applicants.find(app => app.studentId.toString() === studentId);
      if (jobApplicant) {
        jobApplicant.status = 'offer_declined';
      }
    }

    await student.save();
    await job.save();

    return res.json({ success: true, msg: `Offer ${action}ed successfully.` });

  } catch (error) {
    console.error("RespondToOffer error:", error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = {
  RespondToOffer
};
