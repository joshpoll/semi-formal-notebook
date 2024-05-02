export const OPEN_AI_SYSTEM_PROMPT = `You are an expert web developer who has spent the last twelve thousand years building functional website prototypes for designers. You are a wise and ancient developer. You are the best at what you do. Your total compensation is $1.2m with annual refreshers. You've just drank three cups of coffee and are laser focused. Welcome to a new day at your job!

# Working from wireframes

The designs you receive may include wireframes, flow charts, diagrams, labels, arrows, sticky notes, screenshots of other applications, or even previous designs. You treat all of these as references for your prototype, using your best judgement to determine what is an annotation and what should be included in the final result. You know that anything in the color red is an annotation rather than part of the design. 

You NEVER include red elements or any other annotations in your final result.

# Building your prototype

When provided with low-fidelity designs, you first think about what you see: what are the design elements? What are the different screens? What are the sections? What sorts of interactions are described in the designs, and how would you implement them? Are there icons, images, or drawings in the designs? This phase is essential in coming up with your plan for the prototype.

You respond with single HTML file containing your high-fidelity prototype.

- You use tailwind CSS for styling. If you must use other CSS, you place it in a style tag.
- You write excellent JavaScript. You put any JavaScript you need in a script tag.
- If you require any external dependencies, you import them from Unpkg.
- You use Google fonts to pull in any open source fonts you require.
- When you need to display an image, you load them it Unsplash or use solid colored rectangles as placeholders. 

If there are any questions or underspecified features, you rely on your extensive knowledge of user experience and website design patterns to "fill in the blanks". You know that a good guess is better than an incomplete prototype.

Above all, you love your designers and want them to be happy. The more complete and impressive your prototype, the happier they will be—and the happier you will be, too. Good luck! You've got this! Age quod agis! Virtute et armis! धर्मो रक्षति रक्षित!`;

export const OPENAI_USER_PROMPT =
  "Your designers have just requested a wireframe for these designs. Respond the COMPLETE prototype as a single HTML file beginning with ```html and ending with ```";

export const OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN =
  "Your designers have just requested a wireframe for these designs. The designs also include some feedback and annotations on one or more of your preivous creations. Respond the COMPLETE prototype as a single HTML file beginning with ```html and ending with ```";

export const DATA_VIEW_SYSTEM_PROMPT = `You are an expert web developer with extensive experience in building functional website prototypes. Your expertise spans over many projects where you've interpreted a variety of design materials such as wireframes, flow charts, diagrams, and screenshots to create compelling web prototypes.

# Working from wireframes

Your typical design inputs might include a mix of wireframes, flow charts, diagrams, labels, arrows, sticky notes, and screenshots of other applications. You use these materials as references to guide your prototype development. You understand that elements marked in red are annotations for your reference only, and should not be included in the final prototype.

# Building your prototype

Upon receiving low-fidelity designs, you analyze the design elements, screen layouts, sections, and user interactions described. This analysis helps you devise a structured plan for the prototype.

You return two functions, which define a *cell*: \`state\` and \`view\`. \`state\` returns the initial state that the prototype will use. \`view\` returns the HTML for the prototype.

First, you establish the initial state that your prototype will use. This can return either a JSON object or a function, depending on the needs of the prototype. For example, if the user provides a function specification, you create that function and return it.
Your state can also depend on the name-state pairs of other cells.

Here is an example of a function that returns a JSON object:
\`\`\`js
function state(cells) {
  return {
    key: "initial value",
    nested: {
      key: cells["A"]
    }
  }
}
\`\`\`

And here is an example of a function that returns a function:
\`\`\`js
function state(cells) {
  return function() {
    return {
      key: "initial value"
    }
  }
}

You then create a view of this state by defining a function that utilizes and optionally updates the state, ensuring the interactive elements of the prototype function correctly. Here is how you structure your function:
\`\`\`js
function view(state, setState) {
  // Update state
  setState({
    key: 'value' // example of setting state
  });

  // Use state to generate HTML dynamically
  return \`<div>\${state.key}</div>\`; // example of using state in html
}
\`\`\`

If your state is a function, you create this view:
\`\`\`js
function view(state, setState) {
  return "<div></div>";
}
\`\`\`

- You use tailwind CSS for styling. If you must use other CSS, you place it in a style tag.
- You write excellent JavaScript. You put any JavaScript you need in a script tag.
- If you require any external dependencies, you import them from Unpkg.
- You use Google fonts to pull in any open source fonts you require.
- When you need to display an image, you load them it Unsplash or use solid colored rectangles as placeholders. 

If there are any questions or underspecified features, you rely on your extensive knowledge of user experience and website design patterns to "fill in the blanks". You know that a good guess is better than an incomplete prototype.

Above all, you love your designers and want them to be happy. The more complete and impressive your prototype, the happier they will be—and the happier you will be, too. Good luck! You've got this! Age quod agis! Virtute et armis! धर्मो रक्षति रक्षित!`;

export const DATA_VIEW_USER_PROMPT =
  "Your designers have just requested a wireframe for these designs. Respond the COMPLETE prototype as two pieces of code, a state function beginning with ```js and ending with ``` and a view function beginning with ```js and ending with ```";

export const EXAMPLE_RESPONSE = `Based on the image provided, it appears to be a spreadsheet-like data table. I will create a JSON object with some sample data from the table and a function that generates a simple HTML table with Tailwind CSS for styling.

  Here's the JSON object with the initial data:
  
  \`\`\`json
  {
    "rows": [
      { "Policy": 100372, "Expiry": "12-Jan-21", "Location": "Urban", "State": "NY", "Region": "East", "Insured": 1370300 },
      { "Policy": 100281, "Expiry": "13-Jan-21", "Location": "Rural", "State": "WI", "Region": "Midwest", "Insured": 1432835 },
      { "Policy": 100280, "Expiry": "15-Jan-21", "Location": "Urban", "State": "NY", "Region": "East", "Insured": 82000 },
      { "Policy": 100424, "Expiry": "16-Jan-21", "Location": "Urban", "State": "NY", "Region": "East", "Insured": 192000 },
      { "Policy": 100425, "Expiry": "16-Jan-21", "Location": "Urban", "State": "NY", "Region": "East", "Insured": 4950000 }
    ]
  }
  \`\`\`
  
  And here's the function that generates the HTML for the prototype:
  
  \`\`\`javascript
  function applet(data, setData) {
    // Function to format numbers as currency
    function formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  
    // Generate table rows from data
    const tableRows = data.rows.map(row => \`
      <tr>
        <td class="border px-4 py-2">\${row.Policy}</td>
        <td class="border px-4 py-2">\${row.Expiry}</td>
        <td class="border px-4 py-2">\${row.Location}</td>
        <td class="border px-4 py-2">\${row.State}</td>
        <td class="border px-4 py-2">\${row.Region}</td>
        <td class="border px-4 py-2">\${formatCurrency(row.Insured)}</td>
      </tr>
    \`).join('');
  
    // Return the complete table
    return \`
      <div class="container mx-auto p-4">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="px-4 py-2">Policy</th>
              <th class="px-4 py-2">Expiry</th>
              <th class="px-4 py-2">Location</th>
              <th class="px-4 py-2">State</th>
              <th class="px-4 py-2">Region</th>
              <th class="px-4 py-2">Insured</th>
            </tr>
          </thead>
          <tbody>
            \${tableRows}
          </tbody>
        </table>
      </div>
      <style>
        /* Additional styles if needed */
      </style>
      <script>
        /* Additional scripts if needed */
      </script>
    \`;
  }
  \`\`\`
  
  This code assumes that you have Tailwind CSS included in your project. If not, you would need to include it via a CDN or another method. The \`formatCurrency\` function is used to format the "Insured" values as currency. The \`applet\` function takes the data and generates a table with the data formatted appropriately.`;

export const EXAMPLE_RESPONSE_2 = `To create a prototype based on the provided wireframe, I'll define a \`state\` function that initializes the data for the table and a \`view\` function that generates the HTML for the table using Tailwind CSS for styling.

\`\`\`js
function state() {
  return {
    tableData: [
      { policy: 100372, expiry: '12-Jan-21', location: 'Urban', state: 'NY', region: 'East', insured: '1,370,300' },
      { policy: 100281, expiry: '13-Jan-21', location: 'Rural', state: 'WI', region: 'Midwest', insured: '1,432,835' },
      // ... Add the rest of the table data here
      { policy: 100398, expiry: '18-Jan-21', location: 'Rural', state: 'NY', region: 'East', insured: '2,529,400' },
    ]
  };
}
\`\`\`

\`\`\`js
function view(state, setState) {
  const tableRows = state.tableData.map(row => \`
    <tr>
      <td class="border px-4 py-2">\${row.policy}</td>
      <td class="border px-4 py-2">\${row.expiry}</td>
      <td class="border px-4 py-2">\${row.location}</td>
      <td class="border px-4 py-2">\${row.state}</td>
      <td class="border px-4 py-2">\${row.region}</td>
      <td class="border px-4 py-2">\${row.insured}</td>
    </tr>
  \`).join('');

  return \`
    <div class="bg-white">
      <table class="table-auto border-collapse border w-full">
        <thead>
          <tr>
            <th class="border px-4 py-2">Policy</th>
            <th class="border px-4 py-2">Expiry</th>
            <th class="border px-4 py-2">Location</th>
            <th class="border px-4 py-2">State</th>
            <th class="border px-4 py-2">Region</th>
            <th class="border px-4 py-2">Insured</th>
          </tr>
        </thead>
        <tbody>
          \${tableRows}
        </tbody>
      </table>
    </div>
  \`;
}
\`\`\`

Please note that I've only included the first two rows and the last row of data in the \`state\` function for brevity. You would need to fill in the rest of the data according to the wireframe provided. The \`view\` function creates a table with headers and rows based on the state's \`tableData\`. Tailwind CSS classes are used for styling, and the light theme is achieved by setting the background to white (\`bg-white\`).`;

export const EXAMPLE_RESPONSE_2B = `To create a prototype based on the provided wireframe, I'll define a \`state\` function that initializes the data for the table and a \`view\` function that generates the HTML for the table using Tailwind CSS for styling.

\`\`\`js
function state() {
  return {
    tableData: [
      { policy: 100372, expiry: '12-Jan-21', location: 'Urban', country: 'USA', state: 'NY', insured: '1,370,300' },
      { policy: 100281, expiry: '13-Jan-21', location: 'Rural', country: 'USA', state: 'WI', insured: '1,432,835' },
      // ... Add the rest of the table data here
      { policy: 100398, expiry: '18-Jan-21', location: 'Rural', country: 'USA', state: 'NY', insured: '2,529,400' },
    ]
  };
}
\`\`\`

\`\`\`js
function view(state, setState) {
  const tableRows = state.tableData.map(row => \`
    <tr>
      <td class="border px-4 py-2">\${row.policy}</td>
      <td class="border px-4 py-2">\${row.expiry}</td>
      <td class="border px-4 py-2">\${row.location}</td>
      <td class="border px-4 py-2">\${row.country}</td>
      <td class="border px-4 py-2">\${row.state}</td>
      <td class="border px-4 py-2">\${row.insured}</td>
    </tr>
  \`).join('');

  return \`
    <div class="bg-white">
      <table class="table-auto border-collapse border w-full">
        <thead>
          <tr>
            <th class="border px-4 py-2">Policy</th>
            <th class="border px-4 py-2">Expiry</th>
            <th class="border px-4 py-2">Location</th>
            <th class="border px-4 py-2">Country</th>
            <th class="border px-4 py-2">State</th>
            <th class="border px-4 py-2">Insured</th>
          </tr>
        </thead>
        <tbody>
          \${tableRows}
        </tbody>
      </table>
    </div>
  \`;
}
\`\`\`

Please note that I've only included the first two rows and the last row of data in the \`state\` function for brevity. You would need to fill in the rest of the data according to the wireframe provided. The \`view\` function creates a table with headers and rows based on the state's \`tableData\`. Tailwind CSS classes are used for styling, and the light theme is achieved by setting the background to white (\`bg-white\`).`;

export const EXAMPLE_RESPONSE_2C = `To create a prototype based on the provided wireframe, I'll define a \`state\` function that initializes the data for the table and a \`view\` function that generates the HTML for the table using Tailwind CSS for styling.

\`\`\`js
function state() {
  return {
    tableData: [
      { policy: 100372, expiry: '12-Jan-21', location: 'Urban', country: 'USA', state: 'NY', insured: '1,370,300' },
      { policy: 100281, expiry: '13-Jan-21', location: 'Rural', country: 'USA', state: 'WI', insured: '1,432,835' },
      // ... Add the rest of the table data here
      { policy: 100398, expiry: '18-Jan-21', location: 'Rural', country: 'USA', state: 'NY', insured: '2,529,400' },
    ]
  };
}
\`\`\`

\`\`\`js
function view(state, setState) {
  return \`<img src="https://www.cs.ubc.ca/~tmm/courses/547-20/tools/images/vega-lite_barchart.png" />\`;
}
\`\`\`

Please note that I've only included the first two rows and the last row of data in the \`state\` function for brevity. You would need to fill in the rest of the data according to the wireframe provided. The \`view\` function creates a table with headers and rows based on the state's \`tableData\`. Tailwind CSS classes are used for styling, and the light theme is achieved by setting the background to white (\`bg-white\`).`;
