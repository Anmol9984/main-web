document.addEventListener("DOMContentLoaded", function() {
    const title = document.getElementById("banner-title");
    const text = title.textContent;
    title.textContent = ""; // Clear the title text

    let index = 0;

    function typeLetter() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeLetter, 300); // Adjust the speed here (300ms)
        }
    }

    typeLetter(); // Start the typing effect

    // Enable form fields based on project selection
    const projectSelect = document.getElementById('project-select');
    const nameInput = document.getElementById('name');
    const fileNoInput = document.getElementById('fileNo');
    const getDetailsBtn = document.getElementById('get-details-btn');

    projectSelect.addEventListener('change', function() {
        if (projectSelect.value) {
            nameInput.disabled = false;
            fileNoInput.disabled = false;
            getDetailsBtn.disabled = false;
        } else {
            nameInput.disabled = true;
            fileNoInput.disabled = true;
            getDetailsBtn.disabled = true;
        }
    });

    // Fetch and display project details
    getDetailsBtn.addEventListener('click', function() {
        const fileNo = fileNoInput.value.trim();
        const project_title = projectSelect.value;

        // Check if the project type is selected
        if (!project_title) {
            alert("Please select a project type.");
            return;
        }

        console.log('Requesting details with:', { fileNo, project_title }); // Debugging line

        fetch('http://localhost:3000/get-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileNo, project_title })
        })
        .then(response => response.json())
        .then(data => {
            // Log the data to check if it contains the expected items
            console.log('Fetched data:', data); // Debugging line

            // Open a new window/tab and display the results
            const newWindow = window.open('', '_blank');
            newWindow.document.write('<html><head><title>Search Results</title>');
            newWindow.document.write('<style>'); // Add styles for the table
            newWindow.document.write('table { width: 100%; border-collapse: collapse; }');
            newWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
            newWindow.document.write('th { background-color: #f2f2f2; }');
            newWindow.document.write('h1 { text-align: center; }'); // Center the heading
            newWindow.document.write('</style></head><body>');

            newWindow.document.write('<h1>Detailed Search Results</h1>');

            // Check if data is not empty
            if (data.length > 0) {
                data.forEach(item => {
                    newWindow.document.write('<table>');
                    newWindow.document.write('<tr><th>File No</th><td>' + item.file_number + '</td></tr>');
                    newWindow.document.write('<tr><th>Project Coordinator</th><td>' + item.name_of_project_coordinator + '</td></tr>');
                    newWindow.document.write('<tr><th>Title of Proposal</th><td>' + item.final_title_of_proposal + '</td></tr>');
                    newWindow.document.write('<tr><th>PFMS Linked Account</th><td>' + item.pfms_linked_account + '</td></tr>');
                    newWindow.document.write('<tr><th>Debit Date</th><td>' + item.debit_date + '</td></tr>');
                    newWindow.document.write('<tr><th>Executive Summary</th><td><a href="' + item.executive_summary_link + '" target="_blank">View Executive Summary</a></td></tr>');
                    newWindow.document.write('<tr><th>Final Report</th><td><a href="' + item.final_report_link + '" target="_blank">View Final Report</a></td></tr>');
                    newWindow.document.write('</table><br>');
                });
            } else {
                newWindow.document.write('<p>No data found</p>');
            }

            newWindow.document.write('</body></html>');
            newWindow.document.close();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch details. Please try again later.');
        });
    });
});