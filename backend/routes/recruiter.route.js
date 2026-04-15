const express = require('express');

// router after /recruiter/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');

const Register = require('../controllers/Recruiter/recruiter.register.controller');
const Login = require('../controllers/Recruiter/recruiter.login.controller');
const { GetMyCompany, AddOrUpdateMyCompany } = require('../controllers/Recruiter/recruiter.company.controller');
const { PostRecruiterJob, GetRecruiterJobs, DeleteRecruiterJob } = require('../controllers/Recruiter/recruiter.job.controller');

// public routes
router.post('/register', Register);
router.post('/login', Login);

// company routes (auth required)
router.get('/my-company', authenticateToken, GetMyCompany);
router.post('/my-company', authenticateToken, AddOrUpdateMyCompany);

// job routes (auth required)
router.get('/jobs', authenticateToken, GetRecruiterJobs);
router.post('/post-job', authenticateToken, PostRecruiterJob);
router.post('/delete-job', authenticateToken, DeleteRecruiterJob);

module.exports = router;
