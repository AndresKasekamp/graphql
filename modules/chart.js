import * as d3 from "d3";

/**
 * Creating the pie chart for up/down audits
 * @param {array} upDownData - array consisting of numbers for up/down data
 */
const createAuditRatioChart = (upDownData) => {
  // Calculate total value
  const total = upDownData.reduce((acc, val) => acc + val, 0);

  // SVG container
  const svg = document.getElementById("pieChart");

  // Create a title element (text) within the SVG
  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "50%"); // Set x position (centered horizontally)
  title.setAttribute("y", "12"); // Set y position (adjust as needed)
  title.setAttribute("text-anchor", "middle"); // Center align text
  title.setAttribute("font-size", "10"); // Set font size
  title.textContent = "Audits done/received"; // Set your desired title text

  svg.appendChild(title); // Append the title to the SVG

  // Pie chart settings
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  let startAngle = 0;

  const colors = ["#05386B", "#FC4445"]; // Define your desired colors here

  // Loop through data to create pie slices
  upDownData.forEach((value, index) => {
    const percentage = (value / total) * 100;
    const endAngle = startAngle + percentage * 3.6; // Convert percentage to degrees (360/100 = 3.6)

    // Calculate arc path
    const arcPath = `
    M ${centerX},${centerY}
    L ${centerX + radius * Math.cos((startAngle * Math.PI) / 180)},${
      centerY + radius * Math.sin((startAngle * Math.PI) / 180)
    }
    A ${radius},${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0},1
    ${centerX + radius * Math.cos((endAngle * Math.PI) / 180)},${
      centerY + radius * Math.sin((endAngle * Math.PI) / 180)
    }
    Z
  `;

    // Create SVG path element for each slice
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", arcPath);
    path.setAttribute("fill", colors[index]);
    svg.appendChild(path);

    // Calculate label position for each slice
    const labelAngle = startAngle + (percentage / 2) * 3.6; // Middle angle of the slice
    const labelX =
      centerX + (radius / 1.5) * Math.cos((labelAngle * Math.PI) / 180);
    const labelY =
      centerY + (radius / 1.5) * Math.sin((labelAngle * Math.PI) / 180);

    // Create SVG text element for the label
    const labelText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    labelText.setAttribute("x", labelX);
    labelText.setAttribute("y", labelY);
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "12");
    labelText.setAttribute("fill", "#37FBB3");
    if (index === 0) {
      labelText.textContent = `⬆️ ${value} mb`;
    } else if (index === 1) {
      labelText.textContent = `⬇️ ${value} mb`;
    }
    //labelText.textContent = `Section ${index + 1}`; // Set label text, replace with your data labels
    svg.appendChild(labelText);

    startAngle = endAngle; // Update start angle for the next slice
  });
};

/**
 * XP progression chart logic and listener
 * @param {array} data - array consisting of objects for rendering xp and dates
 */
const createProgressionChart = (data) => {
  // Parse dates and sort data by createdAt
  data.forEach((obj) => {
    obj.createdAt = new Date(obj.createdAt);
  });
  data.sort((a, b) => a.createdAt - b.createdAt);

  // Get SVG element and create scales
  const svg = document.getElementById("progressionChart");
  const chartArea = document.getElementById("chartArea");
  const width = parseInt(svg.getAttribute("width"), 10) - 100;
  const height = parseInt(svg.getAttribute("height"), 10) - 60;

  // Create a title element (text) within the SVG
  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "50%"); // Set x position (centered horizontally)
  title.setAttribute("y", "15"); // Set y position (adjust as needed)
  title.setAttribute("text-anchor", "middle"); // Center align text
  title.setAttribute("font-size", "18"); // Set font size
  title.textContent = "XP progression"; // Set your desired title text
  svg.appendChild(title); // Append the title to the SVG

  let xScale, yScale, cumulativeData;

  function updateChart(selectedSubset) {
    let filteredData = data;

    if (selectedSubset === "3months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filteredData = data.filter((d) => d.createdAt >= threeMonthsAgo);
    } else if (selectedSubset === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filteredData = data.filter((d) => d.createdAt >= sixMonthsAgo);
    } else if (selectedSubset === "9months") {
      const nineMonthsAgo = new Date();
      nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);
      filteredData = data.filter((d) => d.createdAt >= nineMonthsAgo);
    }

    // Calculate cumulative values for filtered data
    let cumulativeValue = 0;
    cumulativeData = filteredData.map((point) => {
      cumulativeValue += point.amount;
      return { createdAt: point.createdAt, cumulativeValue };
    });

    // Recreate scales based on filtered data
    xScale = d3
      .scaleTime()
      .domain(d3.extent(cumulativeData, (d) => d.createdAt))
      .range([0, width]);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(cumulativeData, (d) => d.cumulativeValue)])
      .range([height, 0]);

    // Create line function
    const line = d3
      .line()
      .x((d) => xScale(d.createdAt))
      .y((d) => yScale(d.cumulativeValue));

    // Update line in SVG
    const path = document.getElementById("line");
    path.setAttribute("d", line(cumulativeData));

    // Update x-axis with gridlines
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%d.%m"))
      .tickSize(-height)
      .tickPadding(10);

    const xAxisGroup = d3
      .select("#xAxis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("line")
      .attr("stroke", "#ccc") // Style gridlines
      .attr("stroke-dasharray", "4"); // Add dash styling to gridlines

    // Update y-axis with gridlines
    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-width) // Make gridlines span the width of the chart
      .tickPadding(10); // Adjust padding for readability

    const yAxisGroup = d3
      .select("#yAxis")
      .call(yAxis)
      .selectAll("line")
      .attr("stroke", "#ccc") // Style gridlines
      .attr("stroke-dasharray", "4"); // Add dash styling to gridlines
  }

  updateChart("all");
  // Initial chart render
  // Function to update chart dimensions

  const dropdownLinks = document.querySelectorAll(".dropdown-content a");

  // Handle click event on dropdown content
  dropdownLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link behavior
      const selectedValue = this.getAttribute("data-value");
      updateChart(selectedValue);
      // You can perform actions based on the selected value here
    });
  });
};

export { createAuditRatioChart, createProgressionChart };
