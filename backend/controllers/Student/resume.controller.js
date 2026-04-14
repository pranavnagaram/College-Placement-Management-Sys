const User = require("../../models/user.model.js");
const fs = require('fs');
const path = require("path");

const UploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No resume uploaded" });
    }

    // Check for PDF MIME type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ msg: "Only PDF files are allowed" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: "Student not found!" });
    }

    // Delete old resume from local if it exists
    if (user.studentProfile.resume) {
      try {
        const oldResumeUrl = user.studentProfile.resume;
        const oldResumeFileName = oldResumeUrl.substring(oldResumeUrl.lastIndexOf("/") + 1);
        const oldResumePath = path.join(__dirname, '../../public/resumes', oldResumeFileName);
        
        if (fs.existsSync(oldResumePath)) {
          fs.unlinkSync(oldResumePath);
        }
      } catch (err) {
        console.error("Error deleting old resume:", err);
      }
    }

    // Generate a unique filename based on original name + timestamp + userId
    const originalName = path.parse(req.file.originalname).name;
    const uniqueFilename = `${originalName}_${Date.now()}_${req.body.userId}.pdf`;

    const targetDir = path.join(__dirname, '../../public/resumes');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, uniqueFilename);
    
    // Move the file from req.file.path to targetPath
    fs.copyFileSync(req.file.path, targetPath);
    fs.unlinkSync(req.file.path);

    // The frontend should be able to access it via /resume/filename
    const fileUrl = `${req.protocol}://${req.get('host')}/resume/${uniqueFilename}`;

    // Update resume path in MongoDB
    user.studentProfile.resume = fileUrl;
    await user.save();

    return res.status(200).json({ msg: "Resume uploaded successfully!", url: fileUrl });
  } catch (error) {
    require('fs').writeFileSync('resume_error_log.txt', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error(error);
    return res.status(500).json({ msg: "Server error", error: error.message || error });
  }
};

module.exports = UploadResume;
