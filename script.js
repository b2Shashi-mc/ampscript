// Flag to track if the table is generated
let isTableGenerated = false;
let columns = [];  // Store the table column data
// Select all links with the class 'nav-link'
const navLinks = document.querySelectorAll('.nav-link');


// CodeMirror initialization for the code editor
const editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    lineNumbers: true,
    mode: "javascript", // This can be changed to AMPscript or any other language mode
    theme: "dracula", // Default theme set to dracula (dark mode)
    matchBrackets: true,
    autoCloseBrackets: true, // Automatically close brackets
    extraKeys: { "Ctrl-Space": "autocomplete" }, // Enable autocompletion
    viewportMargin: Infinity, // This makes the editor expand to fit its container
    lineWrapping: true,  // Allows long lines to wrap
});

// Function to fetch content from GitHub and update the code editor
function loadChapterContent(chapterName) {
    // Validate if the table is generated before loading content
    if (!isTableGenerated) {
        showPopupMessage("Please create the data extension first before generating the AMPscript code.");
        return;
    }

    const url = `https://raw.githubusercontent.com/b2Shashi-mc/ampscript/main/${chapterName}.amp`; // Change to the correct URL
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text(); // Get the raw content as text
            } else {
                throw new Error('Chapter not found');
            }
        })
        .then(content => {
            // Replace placeholders with the generated column data based on chapter
            content = replacePlaceholders(content, chapterName);
            editor.setValue(content); // Load the content into the CodeMirror editor
        })
        .catch(error => {
            console.error('Error fetching chapter:', error);
            showPopupMessage('Failed to load chapter content');
        });
}

function generateColumnAssignments(columns = []) {
    let columnAssignments = '';
    let outputLineColumns = '';

    for (let i = 0; i < columns.length; i++) {
        if (columns[i]) {
            columnAssignments += `set @${columns[i].name} = Field(@row, "${columns[i].name}")\n\t\t\t`;

        }
    }
    outputLineColumns += `" ${columns[0].name}: ", @${columns[0].name}`;
    return { columnAssignments, outputLineColumns };
}


// Function to replace placeholders with actual column data based on chapter
function replacePlaceholders(content, chapterName) {
    // Dynamic replacement logic based on chapter
    switch (chapterName) {
        case 'chapter1':
            // Chapter 1 specific replacements
            content = content.replace(/{{attributeToFetch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{attributeToSearch}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            break;

        case 'chapter2':
        case 'chapter3':
            // Replace specific placeholders like {{attributeToSearch}} and {{valueToSearch}}
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');

            // Use the helper function to generate dynamic column assignments
            const { columnAssignments, outputLineColumns } = generateColumnAssignments(columns);

            content = content.replace(/{{columnAssignments}}/g, columnAssignments);
            content = content.replace(/{{outputLineColumns}}/g, outputLineColumns);
            break;

        case 'chapter4':
        case 'chapter5':
            // Chapter 4 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{attributeToSort}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');

            // Use the helper function to generate dynamic column assignments
            const { columnAssignments: chapter4ColumnAssignments, outputLineColumns: chapter4OutputLineColumns } = generateColumnAssignments(columns);

            content = content.replace(/{{columnAssignments}}/g, chapter4ColumnAssignments);
            content = content.replace(/{{outputLineColumns}}/g, chapter4OutputLineColumns);
            break;

        case 'chapter6':
        case 'chapter7':
            // Initialize variables dynamically
            const columnInitialization = columns.map(col => `set @${col.name} = ""`).join("\n\t");

            // Construct InsertData arguments dynamically
            const insertDataColumns = columns
                .map(col => `"${col.name}", @${col.name}`) // Each column as "Name", @Name
                .join(", "); // Join with commas

            // Replace placeholders in the content
            content = content.replace(/{{#columns}}[\s\S]*?{{\/columns}}/g, columnInitialization);
            content = content.replace(/{{#columns_comma}}[\s\S]*?{{\/columns_comma}}/g, insertDataColumns);
            break;
        case 'chapter8':
        case 'chapter9':
        case 'chapter10':
        case 'chapter11':
            if (!columns || columns.length === 0) {
                console.error("Columns array is empty or undefined");
                return content;
            }

            // Replace static placeholders
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');

            // Replace {{#columns}} block for initializing variables
            const columnInitializations = columns.slice(1) // Skip the first column
                .map(col => `set @${col.name} = "DefaultUpdateValue"`)
                .join("\n\t");
            content = content.replace(/{{#columns}}[\s\S]*?{{\/columns}}/g, columnInitializations);


            // Replace {{#columns_comma}} block for UpdateData assignments
            const columnAssignmentschap8 = columns.slice(1)
                .map(col => `"${col.name}", @${col.name}`)
                .join(", ");
            content = content.replace(/{{#columns_comma}}[\s\S]*?{{\/columns_comma}}/g, columnAssignmentschap8);

            break;
        case 'chapter12':
        case 'chapter13':
        case 'chapter14':
            // Chapter 12,13 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');

            // Find the first column of type 'Date' and replace {{datecolumn}}
            const firstDateColumn = columns.find(col => col.type === 'Date');
            content = content.replace(/{{datecolumn}}/g, firstDateColumn ? `"${firstDateColumn.name}"` : '""');

            // Alert if there is no date field
            if (!firstDateColumn) {
                showPopupMessage('There is no date field defined!');
            }
            break;

        case 'chapter16':
        case 'chapter17':
            // Chapter 16 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{rows}}/g, columns ? columns.length - 1 : 0);

            // Replace {{#columns}} block for initializing variables
            const columnInitializationsSalesforce = columns.slice(1) // Skip the first column
                .map(col => `set @${col.name} = Field(@row, "${col.name}")`)
                .join("\n\t\t\t");
            content = content.replace(/{{#columns}}[\s\S]*?{{\/columns}}/g, columnInitializationsSalesforce);

            // Replace {{#columns_comma}} block for UpdateData assignments
            const columnAssignmentsSalesforce = columns.slice(1)
                .map(col => `"${col.name}__c", @${col.name}`)
                .join(", ");
            content = content.replace(/{{#columns_comma}}[\s\S]*?{{\/columns_comma}}/g, columnAssignmentsSalesforce);
            break;
        // Add more cases as needed for other chapters
        default:
            console.warn(`No specific replacement logic for chapter: ${chapterName}`);
            break;
    }

    return content;
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = editor.getOption("theme");
    const newTheme = currentTheme === "dracula" ? "default" : "dracula";
    editor.setOption("theme", newTheme);

    const body = document.body;
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");
}

document.getElementById("toggleThemeButton").addEventListener("click", toggleTheme);

// Handle chapter selection from the navigation menu
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        const chapterName = event.target.getAttribute('data-chapter'); // Assuming each link has a `data-chapter` attribute
        loadChapterContent(chapterName); // Load the chapter content into the editor
        // Remove 'active' class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});

// Column Definition and Table Row Generation
document.getElementById("defineColumns").addEventListener("click", function () {
    const numColumns = document.getElementById("numColumns").value;
    const columnContainer = document.getElementById("columnContainer");

    if (numColumns < 3) {
        showPopupMessage("Please specify at least 3 attributes that you would like to define for the data extension.");
        document.getElementById('numColumns').focus();
        return;
    }

    columnContainer.innerHTML = ''; // Clear previous input fields

    columns = [];  // Reset columns array

    for (let i = 0; i < numColumns; i++) {
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("column-input");

        columnDiv.innerHTML = ` 
            <input type="text" id="colName${i}" placeholder="Attribute Name" required>
            <select id="colType${i}">
                <option value="Text">Text</option>
                <option value="EmailAddress">EmailAddress</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
                <option value="Boolean">Boolean</option>
                <option value="Phone">Phone</option>
                <option value="Locale">Locale</option>
            </select>
            <input type="number" id="colLength${i}" placeholder="Max Length" required>
        `;
        columnContainer.appendChild(columnDiv);



        const dataTypeSelect = document.getElementById(`colType${i}`);
        const maxLengthInput = document.getElementById(`colLength${i}`);

        dataTypeSelect.addEventListener("change", function () {
            if (dataTypeSelect.value === "Date" || dataTypeSelect.value === "Number" || dataTypeSelect.value === "Boolean" || dataTypeSelect.value === "Phone" || dataTypeSelect.value === "Locale") {
                maxLengthInput.disabled = true; // Disable Max Length input for Date or Number
                maxLengthInput.value = "";
            } else if (dataTypeSelect.value === "EmailAddress") {
                maxLengthInput.disabled = true; // Enable Max Length input for other types
                maxLengthInput.value = 254;
            }
            else {
                maxLengthInput.value = 50;
                maxLengthInput.disabled = false; // Enable Max Length input for other types
            }
        });

        // Trigger the change event once to set the initial state
        if (dataTypeSelect.value === "Date" || dataTypeSelect.value === "Number") {
            maxLengthInput.disabled = true;
        }
    }

    document.getElementById("generateTableButton").style.display = "inline-block";
    document.getElementById("columnForm").style.display = "none";
});

document.getElementById("generateTableButton").addEventListener("click", function () {
    const numColumns = document.getElementById("numColumns").value;
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = ''; // Clear previous table if any

    columns = [];  // Reset columns array
    for (let i = 0; i < numColumns; i++) {
        const colName = document.getElementById(`colName${i}`).value;
        const colType = document.getElementById(`colType${i}`).value;
        const colLength = document.getElementById(`colLength${i}`).value;

        if (colType === "Text") {
            if (!colName || !colType || !colLength) {
                showPopupMessage(`Please fill in all details for Attribute ${i + 1}`);
                document.getElementById(`colName${i}`).focus();
                return;
            }
        }

        columns.push({ name: colName, type: colType, length: colLength });
    }

    const table = document.createElement("table");
    table.classList.add("table");
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = table.insertRow();
    const headers = ['Column Name', 'Data Type', 'Max Length'];
    headers.forEach(headerText => {
        const cell = headerRow.insertCell();
        cell.innerHTML = `<strong>${headerText}</strong>`;
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '8px';
        cell.style.textAlign = 'left';
    });

    columns.forEach(col => {
        const row = table.insertRow();
        const columnData = [col.name, col.type, col.length];
        columnData.forEach(data => {
            const cell = row.insertCell();
            cell.innerHTML = data;
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '8px';
            cell.style.textAlign = 'left';
        });
    });

    tableContainer.appendChild(table);

    document.getElementById("defineColumns").style.display = "none";
    document.getElementById("generateTableButton").style.display = "none";
    document.getElementById("columnContainer").style.display = "none";
    document.getElementById("numColumns").style.display = "none";

    // Create the container for buttons (Flexbox container)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container"); // Apply flexbox layout
    tableContainer.appendChild(buttonContainer);

    // Add Add Row button to the container
    const addRowButton = document.createElement("button");
    addRowButton.id = "addRowButton";
    addRowButton.innerText = "Add Row";
    addRowButton.style.display = "none"; // Hide initially
    buttonContainer.appendChild(addRowButton);

    addRowButton.addEventListener("click", function () {
        const newRow = table.insertRow();
        const emptyData = ['', '', '']; // Empty data for new row
        emptyData.forEach((data, index) => {
            const cell = newRow.insertCell(index);
            const input = document.createElement("input");
            input.type = "text";
            input.value = data;
            cell.appendChild(input);
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '8px';
            cell.style.textAlign = 'left';
        });

        // After adding a row, add a placeholder to the columns array
        columns.push({ name: '', type: '', length: '' }); // New empty row data
    });

    // Edit button logic
    const editButtonContainer = document.getElementById("editButtonContainer");
    editButtonContainer.innerHTML = "";

    const editButton = document.createElement("button");
    editButton.id = "editButton";
    editButton.innerText = "Edit";
    buttonContainer.appendChild(editButton); // Add button to the container

    let isEditing = false;

    editButton.addEventListener("click", function () {
        const tableRows = table.getElementsByTagName("tr");

        if (isEditing) {
            // Validate fields before saving
            let isValid = true;
            let isValidDataType = true;
            let isValidLength=true;
            for (let i = 1; i < tableRows.length; i++) { // Skip the header row (index 0)
                const cells = tableRows[i].getElementsByTagName("td");
                const inputName = cells[0].querySelector("input");
                const inputType = cells[1].querySelector("input");
                const inputLength = cells[2].querySelector("input");

                // Check if any input is empty
                if (!inputName.value || !inputType.value || !inputLength.value) {
                    isValid = false;
                    break;
                }
                

                if (inputType.value !== "Text" && inputType.value !== "Boolean" && inputType.value !== "Number"
                    && inputType.value !== "Date" && inputType.value !== "Locale" && inputType.value !== "Phone"
                    && inputType.value !== "EmailAddress") {
                    isValidDataType = false;
                    break; // Stop further checks if the data type is invalid
                }

                if (isNaN(inputLength.value)) {
                    isValidLength = false;
                    break;
                }

            }

            if (!isValid) {
                showPopupMessage("Please fill in all fields before saving.");
                return; // Prevent save if validation fails
            }
            if (!isValidDataType) {
                showPopupMessage("Invalid data type selected.");
                return; // Prevent save if validation fails
            }

            if (!isValidLength) {
                showPopupMessage("Please enter a valid number for length");
                return; // Prevent save if validation fails
            }

            // If all rows are valid, save the values to the table
            for (let i = 1; i < tableRows.length; i++) { // Skip the header row
                const cells = tableRows[i].getElementsByTagName("td");
                const inputName = cells[0].querySelector("input");
                const inputType = cells[1].querySelector("input");
                const inputLength = cells[2].querySelector("input");

                // Save the edited values to the columns array
                columns[i - 1].name = inputName.value;
                columns[i - 1].type = inputType.value;
                columns[i - 1].length = inputLength.value;

                // Update table with the edited values
                cells[0].innerHTML = inputName.value;
                cells[1].innerHTML = inputType.value;
                cells[2].innerHTML = inputLength.value;
            }

            editButton.innerText = "Edit"; // Change button text back to "Edit"
            addRowButton.style.display = "none"; // Hide Add Row button after saving
        } else {
            // Enable editing in the table cells
            for (let i = 1; i < tableRows.length; i++) { // Skip header row
                const cells = tableRows[i].getElementsByTagName("td");
                const originalText = cells[0].innerText;
                const originalType = cells[1].innerText;
                const originalLength = cells[2].innerText;

                // Replace table cell contents with input fields for editing
                cells[0].innerHTML = `<input type="text" value="${originalText}">`;
                cells[1].innerHTML = `<input type="text" value="${originalType}">`;
                cells[2].innerHTML = `<input type="text" value="${originalLength}">`;
            }
            editButton.innerText = "Save"; // Change button text to "Save"
            addRowButton.style.display = "inline"; // Show Add Row button when in edit mode
        }

        isEditing = !isEditing; // Toggle edit state
    });

    isTableGenerated = true;
    // Re-fetch and update the content in the editor with new column values
    refreshCode();
});





// Function to update progress indicator
function updateProgress() {
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPosition = window.scrollY;
    var progress = (scrollPosition / scrollHeight) * 100;

    // Update the progress bar width
    document.getElementById('progressIndicator').style.width = progress + '%';
}

// Add event listener to update progress on scroll
window.addEventListener('scroll', updateProgress);

// Initialize progress on page load
updateProgress();

// Copy content to clipboard
function copyCode() {
    // Get the content from the CodeMirror editor (latest content)
    var codeContent = editor.getValue();

    // Create a temporary textarea to hold the content for copying
    var textarea = document.createElement('textarea');
    textarea.value = codeContent;

    // Append the textarea to the document body
    document.body.appendChild(textarea);

    // Select and copy the content
    textarea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Show a modal or alert confirming the content is copied
    showCopyModal();
}

// Show copy confirmation modal
function showCopyModal() {
    var modal = document.getElementById('copyModal');
    modal.style.display = 'block';

    // Hide modal after 2 seconds
    setTimeout(function () {
        modal.style.display = 'none';
    }, 2000);
}

// Search function for the chapters
document.getElementById('chapterSearch').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase(); // Get the input value and convert it to lowercase
    const chapterListItems = document.querySelectorAll('.chapter-list li'); // Select all list items in the chapter list

    chapterListItems.forEach(function (item) {
        const chapterText = item.textContent.toLowerCase(); // Get the text of each list item
        if (chapterText.includes(searchQuery)) {
            item.style.display = ''; // Show the item if it matches the search query
        } else {
            item.style.display = 'none'; // Hide the item if it doesn't match
        }
    });
});

// Show the popup modal when the page loads
window.onload = function () {
    // document.getElementById('popupModal').style.display = 'block';
    document.getElementById('numColumns').focus();
};

// Close the modal when the user clicks the close button
document.getElementById('closeModal').onclick = function () {
    document.getElementById('popupModal').style.display = 'none';
    document.getElementById('numColumns').focus();
};

// You can also close the modal when the user clicks the "Define Columns" button
document.getElementById('defineColumnsBtn').onclick = function () {
    document.getElementById('popupModal').style.display = 'none';
    document.getElementById('numColumns').focus();
    // Add any additional logic here to show the column input area if necessary
};

document.getElementById('instructionsbtn').onclick = function () {
    document.getElementById('messageModal').style.display = 'none';
    //document.getElementById('numColumns').focus();
    // Add any additional logic here to show the column input area if necessary
};

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
}, false);

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'u' || event.key === 'U')) {
        event.preventDefault();
    }
});

// Show the popup with a custom message
function showPopupMessage(message) {
    const modal = document.getElementById('messageModal');
    const modalContent = document.getElementById('popupMessageContent');
    modalContent.textContent = message;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
        modal.style.display = "none"; // Hide the popup
    }, 5000);
}

// Close the modal when the close button is clicked
document.getElementById('closeMessageModal').addEventListener('click', function () {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
});

// Close the modal if user clicks outside of the modal content
window.addEventListener('click', function (event) {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
});
// Function to set the active chapter link
function setActiveChapterLink(chapterName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active'); // Remove 'active' from all links
    });

    const activeLink = document.querySelector(`.nav-link[data-chapter="${chapterName}"]`);
    if (activeLink) {
        activeLink.classList.add('active'); // Add 'active' class to the clicked link
    }
}

document.getElementById('ws-proxy').addEventListener('click', function () {
    window.open('https://b2shashi-mc.github.io/WS-Proxy/', '_blank');
});

document.getElementById('data-views').addEventListener('click', function () {
    window.open('https://b2shashi-mc.github.io/data-views/', '_blank');
});
document.getElementById('SSJS').addEventListener('click', function () {
    window.open('https://b2shashi-mc.github.io/ssjs-core/', '_blank');
});
document.getElementById('ampscript').addEventListener('click', function () {
    window.open('https://b2shashi-mc.github.io/ampscript-soap-api/', '_blank');
});

function refreshCode() {
    // Reset the content of the code editor
    loadChapterContent(getActiveChapter());
    setActiveChapterLink(getActiveChapter());
}

function getActiveChapter() {
    // Find the active link inside the chapter list
    const activeChapterLink = document.querySelector('.chapter-list .nav-link.active');
    
    // Check if there's an active chapter link
    if (activeChapterLink) {
        // Get the data-chapter attribute of the active link
        return activeChapterLink.getAttribute('data-chapter');
    } else {
        return null; // No active chapter
    }
}
