// Flag to track if the table is generated
let isTableGenerated = false;
let columns = [];  // Store the table column data

// CodeMirror initialization for the code editor
const editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    lineNumbers: true,
    mode: "javascript", // This can be changed to AMPscript or any other language mode
    theme: "dracula", // Default theme set to dracula (dark mode)
    matchBrackets: true,
    autoCloseBrackets: true, // Automatically close brackets
    extraKeys: { "Ctrl-Space": "autocomplete" } // Enable autocompletion
});

// Function to fetch content from GitHub and update the code editor
function loadChapterContent(chapterName) {
    // Validate if the table is generated before loading content
    if (!isTableGenerated) {
        alert("Please generate the table before fetching chapter content.");
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
            alert('Failed to load chapter content');
        });
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
            // Chapter 2 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `${columns[1].name}` : '""');
            break;

        case 'chapter3':
            // Chapter 3 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `${columns[1].name}` : '""');
            break;

        case 'chapter4':
            // Chapter 4 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{attributeToSort}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `${columns[1].name}` : '""');
            break;

        case 'chapter5':
            // Chapter 5 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{attributeToSort}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `${columns[1].name}` : '""');
            break;

        case 'chapter6':
            // Chapter 6 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

        case 'chapter7':
            // Chapter 7 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

        case 'chapter8':
            // Chapter 8 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

        case 'chapter9':
            // Chapter 9 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

        case 'chapter10':
            // Chapter 10 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

        case 'chapter11':
            // Chapter 11 specific replacements
            content = content.replace(/{{column1}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `"${columns[1].name}"` : '""');
            break;

            case 'chapter12':
            case 'chapter13':
            case 'chapter14':
            // Chapter 12,13 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? `"${columns[2].name}"` : '""');

            // Find the first column of type 'Date' and replace {{datecolumn}}
            const firstDateColumn = columns.find(col => col.type === 'Date');
            content = content.replace(/{{datecolumn}}/g, firstDateColumn ? `"${firstDateColumn.name}"` : '""');
            break;

        case 'chapter16':
        case 'chapter17':
            // Chapter 16 specific replacements
            content = content.replace(/{{attributeToSearch}}/g, columns[0] ? `"${columns[0].name}"` : '""');
            content = content.replace(/{{valueToSearch}}/g, columns[2] ? '""' : '""');
            content = content.replace(/{{column1}}/g, columns[0] ? `${columns[0].name}` : '""');
            content = content.replace(/{{column2}}/g, columns[1] ? `${columns[1].name}` : '""');
            content = content.replace(/{{column3}}/g, columns[2] ? `${columns[2].name}` : '""');
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

    if (numColumns <= 0) {
        alert("Please enter a valid number of columns.");
        return;
    }

    columnContainer.innerHTML = ''; // Clear previous input fields

    columns = [];  // Reset columns array

    for (let i = 0; i < numColumns; i++) {
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("column-input");

        columnDiv.innerHTML = ` 
            <input type="text" id="colName${i}" placeholder="Column Name" required>
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
            } else {
                maxLengthInput.disabled = false; // Enable Max Length input for other types
            }
        });

        // Trigger the change event once to set the initial state
        if (dataTypeSelect.value === "Date" || dataTypeSelect.value === "Number") {
            maxLengthInput.disabled = true;
        }
    }

    document.getElementById("generateTableButton").style.display = "inline-block";
});

// Handle the table generation
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
                alert(`Please fill in all details for Column ${i + 1}`);
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

    const editButtonContainer = document.getElementById("editButtonContainer");
    editButtonContainer.innerHTML = "";

    const editButton = document.createElement("button");
    editButton.id = "editButton";
    editButton.innerText = "Edit";
    editButtonContainer.appendChild(editButton);

    let isEditing = false;

    editButton.addEventListener("click", function () {
        const tableRows = table.getElementsByTagName("tr");

        if (isEditing) {
            // Save the edited values
            for (let i = 1; i < tableRows.length; i++) {
                const cells = tableRows[i].getElementsByTagName("td");
                columns[i - 1].name = cells[0].querySelector("input").value;
                columns[i - 1].type = cells[1].querySelector("input").value;
                columns[i - 1].length = cells[2].querySelector("input").value;

                // Save the edited value to the table
                for (let j = 0; j < cells.length; j++) {
                    const cell = cells[j];
                    const input = cell.querySelector("input");
                    cell.innerHTML = input.value; // Save the edited value
                }
            }
            editButton.innerText = "Edit"; // Change button text back to "Edit"
            // Re-fetch and update the content in the editor with new column values
            loadChapterContent('chapter1');
        } else {
            // Enable editing in the table cells
            for (let i = 1; i < tableRows.length; i++) {
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
        }

        isEditing = !isEditing; // Toggle edit state
    });

    isTableGenerated = true;
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
window.onload = function() {
    document.getElementById('popupModal').style.display = 'block';
    document.getElementById('numColumns').focus();
};

// Close the modal when the user clicks the close button
document.getElementById('closeModal').onclick = function() {
    document.getElementById('popupModal').style.display = 'none';
};

// You can also close the modal when the user clicks the "Define Columns" button
document.getElementById('defineColumnsBtn').onclick = function() {
    document.getElementById('popupModal').style.display = 'none';
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