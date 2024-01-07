// Parsing according to data input

/**
 * Day difference helper
 * @param {object} response - response from graphQL
 */
const getDaysActive = (response) => {
  const givenDateString = response.user[0].createdAt;

  // Convert the given date string to a Date object
  const givenDate = new Date(givenDateString);

  // Get today's date
  const today = new Date();

  // Calculate the difference in milliseconds between the two dates
  const differenceInMs = today - givenDate;

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return differenceInDays;
};

const getAddress = (response) => {
  if (response.user[0].attrs.addressCountry !== "Estonia") {
    return null;
  }

  const city = response.user[0].attrs.addressCity;
  const street = response.user[0].attrs.addressStreet;

  if (city === "" || street === "") {
    return null;
  }

  const cityStreet = `${street}, ${city}`;

  return cityStreet;
};

/**
 * Obtaining first and last name from query
 * @param {object} response - response from graphQL
 */
const parseGetName = (response) => {
  const differenceInDays = getDaysActive(response);

  const cityStreet = getAddress(response);

  return [
    response.user[0].firstName,
    response.user[0].lastName,
    response.user[0].id,
    differenceInDays,
    cityStreet,
  ];
};

/**
 * Getting succesful audit count
 * @param {object} response - response from graphQL
 */
const parseGetAuditCount = (response) => {
  return response.user[0].audits_aggregate.aggregate.count;
};

/**
 * Getting up, down and xp in correct format
 * @param {object} response - response from graphQL
 */
const parseUpDownAmount = (response) => {
  return [
    parseFloat((response.downAmount.aggregate.sum.amount / 1000000).toFixed(2)),
    parseFloat((response.upAmount.aggregate.sum.amount / 1000000).toFixed(2)),
    Math.round(response.xpAmount.aggregate.sum.amount / 1000),
  ];
};

/**
 * Getting xp progression in correct format
 * @param {object} response - xp progression logic
 */
const parseXPprogression = (response) => {
  const modTransaction = response.transaction.map((obj) => {
    return {
      amount: obj.amount / 1000,
      createdAt: obj.createdAt,
    };
  });
  return modTransaction;
};

/**
 * Finding succesful auditors
 * @param {object} response - auditors
 */
const parseSuccesfulAuditors = (response) => {
  // Initialize an empty object to store counts
  const succesfulAuditorsCount = {};

  // Iterate through the array and count auditorLogin values
  response.audit.forEach((item) => {
    const login = item.auditorLogin;
    succesfulAuditorsCount[login] = (succesfulAuditorsCount[login] || 0) + 1;
  });

  // Convert the object into an array of key-value pairs
  const loginCountsArray = Object.entries(succesfulAuditorsCount);

  // Sort the array based on the count in ascending order
  loginCountsArray.sort((a, b) => b[1] - a[1]);

  const loginCountsArrayTop10 = loginCountsArray.slice(0, 10);

  return loginCountsArrayTop10;
};

export {
  parseGetName,
  parseGetAuditCount,
  parseUpDownAmount,
  parseXPprogression,
  parseSuccesfulAuditors,
};
