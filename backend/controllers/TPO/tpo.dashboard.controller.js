const User = require('../../models/user.model');
const JobSchema = require('../../models/job.model');
const Company = require('../../models/company.model');

const GetDashboardStats = async (req, res) => {
  try {
    // 1. Total Companies
    const totalCompanies = await Company.countDocuments();

    // 2. Total Jobs (Split)
    const totalPlacementJobs = await JobSchema.countDocuments({ opportunityType: { $ne: 'Internship' } });
    const totalInternshipJobs = await JobSchema.countDocuments({ opportunityType: 'Internship' });

    // 3. Total Students Registered
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 4. Total Applications & Hired (Split)
    const statsByType = await JobSchema.aggregate([
      {
        $project: {
          type: { $cond: { if: { $eq: ["$opportunityType", "Internship"] }, then: "Internship", else: "Placement" } },
          applicants: { $ifNull: ["$applicants", []] }
        }
      },
      { $unwind: { path: "$applicants", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$type",
          totalApplications: { $sum: { $cond: [{ $ifNull: ["$applicants.studentId", false] }, 1, 0] } },
          hiredStudents: {
            $addToSet: {
              $cond: [
                { $in: ["$applicants.status", ["hired", "offer_accepted"]] },
                "$applicants.studentId",
                null
              ]
            }
          }
        }
      }
    ]);

    let placementApps = 0, internshipApps = 0;
    let placementsHired = 0, internshipsHired = 0;

    statsByType.forEach(stat => {
      // Remove null from addToSet
      const uniqueHiredCount = stat.hiredStudents.filter(id => id !== null).length;
      if (stat._id === 'Placement') {
        placementApps = stat.totalApplications;
        placementsHired = uniqueHiredCount;
      } else if (stat._id === 'Internship') {
        internshipApps = stat.totalApplications;
        internshipsHired = uniqueHiredCount;
      }
    });

    // Keeping original overall totals for backwards compatibility in UI if needed
    const totalJobs = totalPlacementJobs + totalInternshipJobs;
    const totalApplications = placementApps + internshipApps;
    const totalHired = await User.countDocuments({
      role: 'student',
      'studentProfile.appliedJobs.status': { $in: ['hired', 'offer_accepted'] }
    });

    // 6. Placements/Internships by Department
    const departmentStatsRaw = await JobSchema.aggregate([
      {
        $project: {
          type: { $cond: { if: { $eq: ["$opportunityType", "Internship"] }, then: "Internship", else: "Placement" } },
          applicants: { $ifNull: ["$applicants", []] }
        }
      },
      { $unwind: { path: "$applicants", preserveNullAndEmptyArrays: false } },
      { $match: { "applicants.status": { $in: ["hired", "offer_accepted"] } } },
      {
        $lookup: {
          from: "users",
          localField: "applicants.studentId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: { type: "$type", department: "$studentInfo.studentProfile.department" },
          students: { $addToSet: "$applicants.studentId" }
        }
      },
      {
        $project: {
          type: "$_id.type",
          department: { $ifNull: ["$_id.department", "Unspecified"] },
          count: { $size: "$students" }
        }
      }
    ]);

    const placementDepartmentStats = [];
    const internshipDepartmentStats = [];

    departmentStatsRaw.forEach(stat => {
      const entry = { name: stat.department, value: stat.count };
      if (stat.type === 'Placement') {
        placementDepartmentStats.push(entry);
      } else {
        internshipDepartmentStats.push(entry);
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalCompanies,
        totalJobs,
        totalPlacementJobs,
        totalInternshipJobs,
        totalStudents,
        totalApplications,
        placementApps,
        internshipApps,
        totalHired,
        placementsHired,
        internshipsHired,
        placementDepartmentStats,
        internshipDepartmentStats
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};

module.exports = {
  GetDashboardStats
};
