function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

    // Use d3 to select the panel with id of `#sample-metadata`

        // Use `.html("") to clear any existing metadata

        // Use `Object.entries` to add each key and value pair to the panel
  var url = "/metadata/"+sample;
  d3.json(url).then(function(response) {

    // console.log(response);


    var sample = d3.select(`#sample-metadata`);
    sample.html("");

    var list =sample.append('ul') 
    Object.entries(response).forEach(function([key, value]) {
        console.log(key, value);
    
        list.append("li")
            .text(`${key}: ${value}`);
    });
  });


        
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
var url = "/samples/"+sample;
d3.json(url).then(function(response) {

  console.log(response);


      //     // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
        x: response.otu_ids,
        y: response.sample_values,
        marker: {
            size: response.sample_values,
            color: response.otu_ids},
        text: response.otu_labels,
        mode: 'markers',
        type: 'scatter'
    };

    var layout = {
        xaxis: {title: 'OTU ID'},
        height: 600,
        width: 1300
    }

  
    Plotly.newPlot('bubble', [trace1], layout);


    // @TODO: Build a Pie Chart

var sample = [];

for (var i = 0; i < response.sample_values.length; i++) { 
    var sample_values = response.sample_values[i]
    var otu_ids = response.otu_ids[i]
    var otu_labels = response.otu_labels[i]
    sample.push({"sample_values": sample_values, "otu_ids": otu_ids, "otu_labels": otu_labels})
}

console.log(sample);
var sample = sample.sort(function(a, b) {
    return parseFloat(b.sample_values) - parseFloat(a.sample_values);
  });

data = sample.slice(0, 10);

var trace = {
    values: data.map(row => row.sample_values),
    labels: data.map(row => row.otu_ids),
    hovertext: data.map(row => row.otu_labels),
    type: 'pie'
  };
  
var layout = {
    height: 600,
    width: 700
};
  
Plotly.newPlot('pie', [trace], layout); 


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

});
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
