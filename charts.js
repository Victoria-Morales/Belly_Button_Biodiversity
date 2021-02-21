function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var chartSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartArray = chartSamples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata;
    var metaFilter = metaArray.filter(metaObj => metaObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var chartResult = chartArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metaFilter[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = chartResult.otu_ids;
    var otuLabels = chartResult.otu_labels;
    var sampleValues = chartResult.sample_values;

      
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metaResult.wfreq);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(x => `OTU ${x}`).reverse();


    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: 'h'
            
    }

    var barData = [trace
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "fuchsia",
      plot_bgcolor: "fuchsia"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
 
    // Start of deliverable 2 - bubble chart

    // 1. Create the trace for the bubble chart.
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Electric'
      }
    };
          
    var bubbleData = [trace1
       ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margins: {t:10},
      hovermode: 'closest',
      width: 1000,
      height: 500,
      plot_bgcolor: "pink",
      paper_bgcolor: "pink"
           
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Start of deliverable 3 - gauge chart

    // 4. Create the trace for the gauge chart.
    var trace2 = {
      domain: { x: [0,1], y: [0,1]},
      type: "indicator",  
      mode: "gauge+number",
      value: washFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      gauge: {
        axis: {range: [0, 10]},
        bar: {color: "black"},
        steps: [
          { range: [0,2], color: "lightpink" },
          { range: [2,4], color: "hotpink" },
          { range: [4,6], color: "deeppink" },
          { range: [6,8], color: "fuchsia" },
          { range: [8,10], color: "darkviolet" }
        ]
      }
    };  
 
    var gaugeData = [trace2
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 0, b: 0 },
      paper_bgcolor: "violet",
           
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);




  });
 
}
