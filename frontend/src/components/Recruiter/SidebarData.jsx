import React from "react";
import { AiFillHome } from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { FaIndustry, FaListUl } from "react-icons/fa";
import { LiaIndustrySolid } from "react-icons/lia";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/recruiter/dashboard",
    icon: <AiFillHome />,
  },
  {
    title: "My Company",
    path: "/recruiter/my-company",
    icon: <LiaIndustrySolid />,
  },
  {
    title: "Job Listings",
    icon: <FaIndustry />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "List All",
        path: "/recruiter/job-listings",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Post New",
        path: "/recruiter/post-job",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
];
