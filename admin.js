document.addEventListener("DOMContentLoaded", function () {
    loadStudents(); // Load students from S3 when the page loads

    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('studentsBody');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            let match = false;

            // Check all cells except the last one (assuming no search in actions column)
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent.toLowerCase();
                if (cellText.includes(searchTerm)) {
                    match = true;
                    break;
                }
            }

            row.style.display = match ? '' : 'none';
        });
    });
});

// Function to load students from S3
async function loadStudents() {
    const studentsTable = document.getElementById("studentsBody");
    studentsTable.innerHTML = ""; // Clear existing rows

    try {
        // Load members from S3
        const params = {
            Bucket: "cnotefit",
            Prefix: "signups/"
        };

        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => file.Key);

        console.log("Files in S3:", files); // Log the files array

        // Fetch and display each member's data
        for (const file of files) {
            const memberData = await fetchMemberData(file);
            if (memberData) {
                const id = memberData.id || "N/A"; // Use the ID from the member data

                // Format the phone number
                const phone = memberData.phone || '';
                const formattedPhone = phone.replace(/(\+\d{3})(\d+)/, '$1 $2'); // Add a space after the country code

                // Format dates (optional)
                const formattedStartDate = memberData.startDate ? new Date(memberData.startDate).toLocaleDateString('en-GB') : '';
                const formattedEndDate = memberData.endDate ? new Date(memberData.endDate).toLocaleDateString('en-GB') : '';

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${id}</td> <!-- ID -->
                    <td>${memberData.firstName || ''}</td> <!-- First Name -->
                    <td>${memberData.lastName || ''}</td> <!-- Last Name -->
                    <td>${formattedPhone}</td> <!-- Phone -->
                    <td>${formattedStartDate}</td> <!-- Start Date -->
                    <td>${memberData.membershipDuration || ''} months</td> <!-- Duration -->
                    <td>${formattedEndDate}</td> <!-- End Date -->
                    <td>${memberData.specialRequest || "N/A"}</td> <!-- Special Requests -->
                    <td>${memberData.gender || ''}</td> <!-- Gender -->
                `;
                studentsTable.appendChild(row);
            }
        }
    } catch (error) {
        console.error("Error loading students from S3:", error);
        alert("Failed to load students. Please try again later.");
    }
}

// Function to fetch individual member data from S3
async function fetchMemberData(fileKey) {
    const params = { Bucket: "cnotefit", Key: fileKey };

    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString("utf-8"));
    } catch (error) {
        console.error("Error fetching file:", fileKey, error);
        return null;
    }
}