function convertNumber2Money(number) {
  // 1000000 => "IDR 1.000.000" without decimal
  return `IDR ${new Intl.NumberFormat("id-ID").format(number)}`;
}

function convertSalaryRange(minSalary, maxSalary) {
  // [1000000, 5000000] => "IDR 1.000.000 - IDR 5.000.000"
  return `${convertNumber2Money(minSalary)} - ${convertNumber2Money(maxSalary)}`;
}

function convertDateString(timestamp) {
  // new Date(Date.now()) => "01 Jan 2022"
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function convertFullDateString(timestamp) {
  // new Date(Date.now()) => "01 Jan 2022 00:00:00"
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function dateDifference(timestamp) {
  const currentDate = new Date();
  const jobDate = new Date(timestamp);
  const timeDifference = currentDate - jobDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(weeksDifference / 4);
  const yearsDifference = Math.floor(monthsDifference / 12);

  if (daysDifference < 1) {
    return "Today";
  }
  if (weeksDifference < 2) {
    return `${daysDifference} days ago`;
  }
  if (monthsDifference < 1) {
    return `${weeksDifference} weeks ago`;
  }
  if (yearsDifference < 1) {
    return `${monthsDifference} months ago`;
  }
  return `${yearsDifference} years ago`;
}

function convertRole(role) {
  switch (role) {
    case "CANDIDATE":
      return "applicant";
    case "RECRUITER":
      return "company";
    default:
      return "all";
  }
}

function convertFe2BeJob(values) {
  return {
    title: values.title,
    description: JSON.stringify({
      description: values.description,
      location: values.location,
      salary: [Number(values.minSalary), Number(values.maxSalary)],
      advantages: values.advantages,
      additionalInfo: values.additionalInfo,
      mode: values.mode,
      type: values.type,
      experienceLevel: values.experienceLevel,
    }),
    skills: [
      "requirements",
      ...values.requirements,
      "responsibilities",
      ...values.responsibilities,
    ],
    majors: values.majors,
    years_of_experience: Number(values.minYearExperience),
  };
}

function convertBe2FeJob(resData) {
  const resDescription = JSON.parse(resData.description);
  const resSkills = resData.skills
    ? {
        requirements: resData.skills.slice(0, resData.skills.indexOf("responsibilities")),
        responsibilities: resData.skills.slice(resData.skills.indexOf("responsibilities") + 1),
      }
    : {};
  return {
    id: resData.id,
    title: resData.title,
    company: resData.company,
    description: resDescription.description,
    location: resDescription.location,
    minSalary: resDescription.salary[0], // must be number
    maxSalary: resDescription.salary[1], // must be number
    advantages: resDescription.advantages,
    additionalInfo: resDescription.additionalInfo,
    mode: resDescription.mode,
    type: resDescription.type,
    experienceLevel: resDescription.experienceLevel,
    ...resSkills,
    majors: resData.majors || null,
    minYearExperience: resData.years_of_experience || null,
    createdAt: resData.createdAt,
    applied: resData.applied,
  };
}

const convertFloatToHundredBase = (float) => {
  // 0.108856 => "10.89"
  return `${(float * 100).toFixed(2)}`;
};

export {
  convertNumber2Money,
  convertSalaryRange,
  convertDateString,
  convertFullDateString,
  dateDifference,
  convertRole,
  convertFe2BeJob,
  convertBe2FeJob,
  convertFloatToHundredBase,
};
