function convertNumber2Money(number) {
  // 1000000 => "IDR 1.000.000" without decimal
  return number && number != 0 ? `IDR ${new Intl.NumberFormat("id-ID").format(number)}` : "IDR 0";
}

function convertSalaryRange(minSalary, maxSalary) {
  // [1000000, 5000000] => "IDR 1.000.000 - IDR 5.000.000"
  return minSalary && maxSalary && minSalary > 0 && maxSalary > 0
    ? `${convertNumber2Money(minSalary)} - ${convertNumber2Money(maxSalary)}`
    : "IDR 0 - IDR 0";
}

const convertFloatToHundredBase = (float) => {
  // 0.108856 => "10.89"
  return float && float != 0.0 ? `${(Number(float) * 100).toFixed(2)}` : "0.00";
};

function convertNumber2Percentage(float) {
  return float && float != 0.0 ? `${(Number(float) * 100).toFixed(2)}%` : "0.00%";
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
    ...values,
    salary: `${values.minSalary} - ${values.maxSalary}`,
    minYearsOfExperience: Number(values.minYearsOfExperience),
  };
}

function convertBe2FeJob(resData) {
  const salary = resData.salary.split(" - ");
  return {
    ...resData,
    minSalary: Number(salary[0]), // must be number
    maxSalary: Number(salary[1]), // must be number
  };
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
  convertNumber2Percentage,
  formatTime,
};
