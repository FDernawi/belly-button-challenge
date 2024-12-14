// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(obj => obj.id === parseInt(sample));


    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Code Section Notes:
// The `buildMetadata` function is responsible for updating the section of the webpage that displays demographic information about the selected sample.
// The function uses D3.js to fetch the data from a JSON file, filter for the specific sample ID, and dynamically update the content on the page.


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;


    // Filter the samples for the object with the desired sample number
    const result = samples.find(obj => obj.id === sample);


    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleData = [
      {
        x: otu_ids, 
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values, 
          color: otu_ids, 
          colorscale: "Earth"
        }
      }
    ];

    // Render the Bubble Chart
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Code Section Notes:
// The `buildCharts` function generates two visualizations: a bubble chart showing all bacteria in the sample and a bar chart showing the top 10 bacteria.
// Data is fetched using D3.js, filtered for the selected sample, and passed to Plotly.js for visualization.


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    const selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });  

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Code Section Notes:
// The `init` function sets up the dashboard when the page first loads. 
// It populates the dropdown menu with sample IDs and initializes the charts and metadata panel using the first sample.

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Code Section Notes:
// The `optionChanged` function is triggered whenever the user selects a new sample from the dropdown. 
// It updates both the charts and metadata to reflect the new sample.

// Initialize the dashboard
init();
