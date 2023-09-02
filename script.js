// Define global arrays to store parsed data
let organizationData = [];
let accountData = [];

const organization_ormCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDf6Por8N0V-0jZHt-6TI4DPxojpD7ejkMMyyxZtp-zRzT6Q-PaPWYtB18Llove1s6AYV_CyW-Kx-9/pub?gid=1579947274&single=true&output=csv";

const account_ormCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDf6Por8N0V-0jZHt-6TI4DPxojpD7ejkMMyyxZtp-zRzT6Q-PaPWYtB18Llove1s6AYV_CyW-Kx-9/pub?gid=727242404&single=true&output=csv";

// Function to fetch and parse CSV data
function fetchAndParseCSV(csvURL, targetArray) {
  return axios
    .get(csvURL)
    .then((response) => {
      // The response.data will contain the CSV content
      const csvData = response.data;

      // Use PapaParse to parse the CSV into an array of objects
      Papa.parse(csvData, {
        header: true, // Assumes the first row contains column headers
        dynamicTyping: true, // Automatically detect numeric and boolean values
        complete: (results) => {
          // Store the parsed data in the target array
          targetArray.push(...results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching Google Spreadsheet CSV:", error);
    });
}

// Fetch and parse the first CSV and store it in organizationData
fetchAndParseCSV(organization_ormCSV, organizationData);

// Fetch and parse the second CSV and store it in accountData
fetchAndParseCSV(account_ormCSV, accountData);

// Function to filter and display optimization settings
function filterAndDisplayOptimization() {
  // Get the value from the <input> element
  const subdomain = document.getElementById("myShopifyDomain").value.trim();

  // Check if the subdomain is not empty
  if (subdomain) {
    // Append the subdomain to the myshopify.com domain
    const fullDomain = subdomain + ".myshopify.com";

    // Filter the organizationData array based on the full domain
    const filteredData = organizationData.filter(
      (entry) => entry.myShopifyDomain === fullDomain
    );

    // Get the <div> element where you want to display the results
    const reportOneDiv = document.getElementById("reportOne");

    // Clear the previous content in the <div>
    reportOneDiv.innerHTML = "";

    // Display the filtered data in the <div>
    if (filteredData.length > 0) {
      const setupData = JSON.parse(filteredData[0].setup);

      // Access the optimization settings from the setupData
      const optimizationSettings = setupData.optimization;

      reportOneDiv.textContent =
        "Optimization Settings for " + fullDomain + ":\n";
      reportOneDiv.appendChild(document.createElement("br"));
      const preElement = document.createElement("pre");
      preElement.textContent = JSON.stringify(optimizationSettings, null, 2);
      reportOneDiv.appendChild(preElement);
    } else {
      reportOneDiv.textContent = "No matching entry found for " + fullDomain;
    }
  } else {
    // Handle the case when the input is empty
    alert("Please enter a subdomain.");
  }
}

//Global shortcut
const $ = (selector) => document.querySelector(selector);

// Listen to the input field for changes and trigger the filtering
const myShopifyDomain = $("#myShopifyDomain");

myShopifyDomain.addEventListener("input", filterAndDisplayOptimization);

//TASK 2-------account_orm
// Loops through all organizations and shows the date they were
// created (DD/MM/YYYY),
// their status, and
// planName sorted by oldest to newest.
// Function to format the date as DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
// Function to list organizations by creation date, status, organizationId, and planName (sorted by date)
function listOrganizationsSorted() {
  const sortedOrganizations = accountData
    .slice() // Create a copy of the accountData array
    .sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)); // Sort by creation date

  return sortedOrganizations.map((org) => ({
    organizationId: org.organizationId, // Include organizationId
    createdDate: formatDate(org.createdDate),
    status: org.status,
    planName: org.planName,
  }));
}
function displayReportTwo() {
  const reportTwoDiv = document.getElementById("reportTwo");

  // Call the function to get sorted organizations
  const sortedOrgs = listOrganizationsSorted();

  // Clear the previous content in the #reportTwo element
  reportTwoDiv.innerHTML = "";

  // Display the sorted organizations in the #reportTwo element
  sortedOrgs.forEach((org) => {
    const orgElement = document.createElement("div");
    orgElement.textContent = `Organization ID: ${org.organizationId}, Created Date: ${org.createdDate}, Status: ${org.status}, Plan Name: ${org.planName}`;
    reportTwoDiv.appendChild(orgElement);
  });
}
const reportTwoBtn = $("#reportTwoBtn");
reportTwoBtn.addEventListener("click", displayReportTwo);
///TASK 3--- account_orm
// Returns the list of organizations whose status is cancelled.

// Function to list organizations with a specific status
function listOrganizationsByStatus(status) {
  return accountData.filter((org) => org.status === status);
}

// Function to display the report in the #reportThree element
function displayReportThree() {
  const reportThreeDiv = document.getElementById("reportThree");

  // Call the function to get organizations with "CANCELLED" status
  const cancelledOrgs = listOrganizationsByStatus("CANCELLED");

  // Clear the previous content in the #reportThree element
  reportThreeDiv.innerHTML = "";

  // Display the organizations with "CANCELLED" status in the #reportThree element
  if (cancelledOrgs.length > 0) {
    cancelledOrgs.forEach((org) => {
      const orgElement = document.createElement("div");
      orgElement.textContent = `Organization ID: ${org.organizationId}, Status: ${org.status}`;
      reportThreeDiv.appendChild(orgElement);
    });
  } else {
    reportThreeDiv.textContent =
      "No organizations with 'CANCELLED' status found.";
  }
}

// Add an event listener to trigger the displayReportThree function when the button is clicked
const reportThreeBtn = $("#reportThreeBtn");
reportThreeBtn.addEventListener("click", displayReportThree);

//TASK 4 ----organization_orm
// Takes the value of an orgName and returns the organization record in JSON format.

// Function to find an organization by orgName
function findOrganizationByOrgName(orgName) {
  return organizationData.find((org) => org.orgName === orgName);
}

// Function to display the report in the #reportFour element
function displayReportFour() {
  const orgNameInput = document.getElementById("orgNameInput").value;
  const reportFourDiv = document.getElementById("reportFour");

  // Call the function to find the organization by orgName
  const foundOrg = findOrganizationByOrgName(orgNameInput);

  // Clear the previous content in the #reportFour element
  reportFourDiv.innerHTML = "";

  // Display the organization with the "setup" part formatted
  if (foundOrg) {
    const orgCopy = { ...foundOrg }; // Create a copy to avoid modifying the original object
    if (orgCopy.setup) {
      orgCopy.setup = JSON.parse(orgCopy.setup); // Parse the "setup" part as an object
    }
    const orgJson = JSON.stringify(orgCopy, null, 2); // Prettify the entire object with 2-space indentation
    const preElement = document.createElement("pre");
    preElement.textContent = orgJson;
    reportFourDiv.appendChild(preElement);
  } else {
    reportFourDiv.textContent = "Organization not found.";
  }
}
// Add an event listener to trigger the displayReportFour function when the button is clicked
const reportFourBtn = document.getElementById("reportFourBtn");
reportFourBtn.addEventListener("click", displayReportFour);
