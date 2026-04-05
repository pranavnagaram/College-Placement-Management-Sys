import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function MyCompany() {
  document.title = 'CPMS | My Company';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [isExisting, setIsExisting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch the recruiter's existing company on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${BASE_URL}/recruiter/my-company`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.company) {
          setData(res.data.company);
          setIsExisting(true);
        }
      })
      .catch((err) => console.log('MyCompany fetch error =>', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.companyName || !data?.companyDescription || !data?.companyDifficulty || !data?.companyLocation || !data?.companyWebsite)
      return setError('All Fields Required!');
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/recruiter/my-company`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.status === 200 || response?.status === 201) {
        setShowModal(false);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('/recruiter/dashboard', { state: dataToPass });
      }
    } catch (err) {
      console.log('MyCompany submit error =>', err);
      setShowModal(false);
      setToastMessage(err?.response?.data?.msg || 'Error saving company!');
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

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <Form onSubmit={handleSubmit}>
        <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-indigo-300 p-6 max-sm:text-sm max-sm:p-3">
          <h2 className="text-lg font-bold text-indigo-700 mb-4">
            {isExisting ? 'Update Company Information' : 'Add Company Information'}
          </h2>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              <FloatingLabel
                controlId="floatingCompanyName"
                label={<><span>Company Name <span className="text-red-500">*</span></span></>}
              >
                <Form.Control
                  type="text"
                  placeholder="Company Name"
                  name="companyName"
                  value={data?.companyName || ''}
                  onChange={handleDataChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingCompanyLocation"
                label={<><span>Company Location <span className="text-red-500">*</span></span></>}
              >
                <Form.Control
                  type="text"
                  placeholder="Company Location"
                  name="companyLocation"
                  value={data?.companyLocation || ''}
                  onChange={handleDataChange}
                />
              </FloatingLabel>
            </div>

            <FloatingLabel
              controlId="floatingCompanyWebsite"
              label={<><span>Company Website <span className="text-red-500">*</span></span></>}
            >
              <Form.Control
                type="text"
                placeholder="Company Website"
                name="companyWebsite"
                value={data?.companyWebsite || ''}
                onChange={handleDataChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingSelectDifficulty"
              label={<><span>Difficulty Level <span className="text-red-500">*</span></span></>}
            >
              <Form.Select
                aria-label="Floating label select difficulty"
                className="cursor-pointer"
                name="companyDifficulty"
                value={data?.companyDifficulty || ''}
                onChange={handleDataChange}
              >
                <option disabled value="">Enter Difficulty Level</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingcompanyDescription"
              label={<><span>Company Description <span className="text-red-500">*</span></span></>}
            >
              <Form.Control
                as="textarea"
                placeholder="Company Description"
                name="companyDescription"
                style={{ height: '100px', maxHeight: '450px' }}
                value={data?.companyDescription || ''}
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
            {isExisting ? 'Update Company' : 'Save Company'}
          </Button>
        </div>
      </Form>

      <ModalBox
        show={showModal}
        close={() => setShowModal(false)}
        header="Confirmation"
        body={`Do you want to ${isExisting ? 'update' : 'add'} company "${data?.companyName}"?`}
        btn="Confirm"
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default MyCompany;
