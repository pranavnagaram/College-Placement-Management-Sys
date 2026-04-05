import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function RecruiterPostJob() {
  document.title = 'CPMS | Post Job';
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCompany, setHasCompany] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({
    jobTitle: '',
    opportunityType: 'Placement',
    jobDescription: '',
    eligibility: '',
    salary: '',
    howToApply: '',
    applicationDeadline: '',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Check if recruiter has a company and optionally load job data for editing
  useEffect(() => {
    setLoading(true);
    const checks = [
      axios.get(`${BASE_URL}/recruiter/my-company`, { headers }),
    ];

    if (jobId) {
      // Load existing jobs to find the one being edited
      checks.push(axios.get(`${BASE_URL}/recruiter/jobs`, { headers }));
    }

    Promise.all(checks)
      .then(([companyRes, jobsRes]) => {
        if (!companyRes.data.company) {
          setHasCompany(false);
        }
        if (jobId && jobsRes) {
          const job = jobsRes.data.jobs?.find((j) => j._id === jobId);
          if (job) {
            setData({
              _id: job._id,
              jobTitle: job.jobTitle || '',
              opportunityType: job.opportunityType || 'Placement',
              jobDescription: job.jobDescription || '',
              eligibility: job.eligibility || '',
              salary: job.salary || '',
              howToApply: job.howToApply || '',
              applicationDeadline: job.applicationDeadline
                ? job.applicationDeadline.substring(0, 10)
                : '',
            });
          }
        }
      })
      .catch((err) => console.log('RecruiterPostJob fetch error =>', err))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.jobTitle || !data.jobDescription)
      return setError('Job title and job description are required!');
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/recruiter/post-job`, data, { headers });
      if (response?.status === 200 || response?.status === 201) {
        setShowModal(false);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('/recruiter/job-listings', { state: dataToPass });
      }
    } catch (err) {
      console.log('RecruiterPostJob submit error =>', err);
      setShowModal(false);
      setToastMessage(err?.response?.data?.msg || 'Error saving job!');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-72 items-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl" />
      </div>
    );
  }

  if (!hasCompany) {
    return (
      <div className="flex flex-col justify-center items-center h-72 gap-4">
        <p className="text-gray-600 text-lg">You need to set up your company before posting a job.</p>
        <Button variant="primary" onClick={() => navigate('/recruiter/my-company')}>
          Set Up Company
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <Form onSubmit={handleSubmit}>
        <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-indigo-300 p-6 max-sm:text-sm max-sm:p-3">
          <h2 className="text-lg font-bold text-indigo-700 mb-4">
            {jobId ? 'Edit Job Posting' : 'Post a New Job Role'}
          </h2>
          <div className="flex flex-col gap-3">
            {/* Title & Salary */}
            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              <FloatingLabel
                controlId="floatingJobTitle"
                label={<><span>Job Title <span className="text-red-500">*</span></span></>}
              >
                <Form.Control
                  type="text"
                  placeholder="Job Title"
                  name="jobTitle"
                  value={data.jobTitle}
                  onChange={handleDataChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingOpportunityType"
                label={<><span>Opportunity Type <span className="text-red-500">*</span></span></>}
              >
                <Form.Select
                  name="opportunityType"
                  value={data.opportunityType}
                  onChange={handleDataChange}
                >
                  <option value="Placement">Placement (Full-Time)</option>
                  <option value="Internship">Internship</option>
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel controlId="floatingJobSalary" label="Salary/Stipend (₹)">
                <Form.Control
                  type="number"
                  placeholder="Salary"
                  name="salary"
                  value={data.salary}
                  onChange={handleDataChange}
                />
              </FloatingLabel>
            </div>

            {/* Application Deadline */}
            <FloatingLabel controlId="floatingDeadline" label="Application Deadline">
              <Form.Control
                type="date"
                placeholder="Application Deadline"
                name="applicationDeadline"
                value={data.applicationDeadline}
                onChange={handleDataChange}
              />
            </FloatingLabel>

            {/* Eligibility */}
            <FloatingLabel controlId="floatingEligibility" label="Eligibility Criteria">
              <Form.Control
                type="text"
                placeholder="Eligibility Criteria"
                name="eligibility"
                value={data.eligibility}
                onChange={handleDataChange}
              />
            </FloatingLabel>

            {/* How to Apply */}
            <FloatingLabel controlId="floatingHowToApply" label="How to Apply">
              <Form.Control
                type="text"
                placeholder="How to Apply"
                name="howToApply"
                value={data.howToApply}
                onChange={handleDataChange}
              />
            </FloatingLabel>

            {/* Job Description */}
            <FloatingLabel
              controlId="floatingJobDescription"
              label={<><span>Job Description <span className="text-red-500">*</span></span></>}
            >
              <Form.Control
                as="textarea"
                placeholder="Job Description"
                name="jobDescription"
                style={{ height: '120px', maxHeight: '450px' }}
                value={data.jobDescription}
                onChange={handleDataChange}
              />
            </FloatingLabel>
          </div>

          {error && (
            <div className="flex pt-2">
              <span className="text-red-500">{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <Button variant="primary" type="submit" size="lg">
            {jobId ? 'Update Job' : 'Post Job'}
          </Button>
        </div>
      </Form>

      <ModalBox
        show={showModal}
        close={() => setShowModal(false)}
        header="Confirmation"
        body={`Do you want to ${jobId ? 'update' : 'post'} the job "${data.jobTitle}"?`}
        btn="Confirm"
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default RecruiterPostJob;
