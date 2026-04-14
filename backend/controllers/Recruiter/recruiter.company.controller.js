const Company = require("../../models/company.model");
const User = require("../../models/user.model");

/**
 * GET /recruiter/my-company
 * Returns the company linked to the logged-in recruiter.
 */
const GetMyCompany = async (req, res) => {
  try {
    const recruiter = req.user;

    if (!recruiter.recruiterProfile?.companyId) {
      return res.status(200).json({ company: null });
    }

    const company = await Company.findById(recruiter.recruiterProfile.companyId);
    return res.status(200).json({ company });
  } catch (error) {
    console.log("recruiter.company.controller.js = GetMyCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

/**
 * POST /recruiter/my-company
 * Creates or updates the company linked to this recruiter.
 */
const AddOrUpdateMyCompany = async (req, res) => {
  try {
    const recruiter = req.user;
    const { companyName, companyDescription, companyWebsite, companyLocation, companyDifficulty } = req.body;

    if (!companyName) {
      return res.status(400).json({ msg: "Company name is required!" });
    }

    // If recruiter already has a company, update it
    if (recruiter.recruiterProfile?.companyId) {
      const company = await Company.findById(recruiter.recruiterProfile.companyId);
      if (company) {
        company.companyName = companyName || company.companyName;
        company.companyDescription = companyDescription || company.companyDescription;
        company.companyWebsite = companyWebsite || company.companyWebsite;
        company.companyLocation = companyLocation || company.companyLocation;
        company.companyDifficulty = companyDifficulty || company.companyDifficulty;
        await company.save();
        return res.status(200).json({ msg: "Company updated successfully!" });
      }
    }

    // Otherwise create a new company and link it to the recruiter
    const newCompany = new Company({
      companyName,
      companyDescription,
      companyWebsite,
      companyLocation,
      companyDifficulty,
    });
    await newCompany.save();

    // Link company to recruiter's profile
    await User.findByIdAndUpdate(recruiter._id, {
      'recruiterProfile.companyId': newCompany._id,
    });

    return res.status(201).json({ msg: "Company created successfully!", companyId: newCompany._id });
  } catch (error) {
    console.log("recruiter.company.controller.js = AddOrUpdateMyCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { GetMyCompany, AddOrUpdateMyCompany };
