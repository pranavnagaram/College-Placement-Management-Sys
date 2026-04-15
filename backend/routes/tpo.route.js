const express = require('express');

// router after /tpo/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');


// tpo login controller
const Login = require('../controllers/TPO/tpo.login.controller');

const PostJob = require('../controllers/TPO/tpo.post-job.controller');
const { GetDashboardStats } = require('../controllers/TPO/tpo.dashboard.controller');

const { AllJobs, DeleteJob, JobData, JobWithApplicants, StudentJobsApplied, UpdateApplicantStatus } = require('../controllers/user/user.all-jobs.controller');

// login post request for student
router.post('/login', Login);


// post job listing data
router.post('/post-job', authenticateToken, PostJob);

// all jobs 
router.get('/jobs',authenticateToken, AllJobs);

// delete job 
router.post('/delete-job',authenticateToken, DeleteJob);

// view a job 
router.get('/job/:jobId', authenticateToken, JobData);

// job with its applicants 
router.get('/job/applicants/:jobId', authenticateToken, JobWithApplicants)

// student jobs applied 
router.get('/myjob/:studentId', authenticateToken, StudentJobsApplied)

// update student job application status
router.put('/job/update-status', authenticateToken, UpdateApplicantStatus);

// dashboard stats
router.get('/dashboard-stats', authenticateToken, GetDashboardStats);


module.exports = router;