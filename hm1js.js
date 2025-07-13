// Clear default text when focusing on input fields
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('focus', function () {
        if (this.value === 'enter your First name' || this.value === 'enter your Last name') {
            this.value = ''; // Clear the input field
        }
    });

    input.addEventListener('blur', function () {
        // Restore placeholder if field is left empty
        if (this.value.trim() === '') {
            if (this.id === 'fname') this.value = 'enter your First name';
            if (this.id === 'lname') this.value = 'enter your Last name';
        }
    });
});

// Function to handle form validation
function calculateEndDate() {
    const startDateInput = document.getElementById('startDate');
    const durationInput = document.getElementById('membershipDuration');
    const endDateInput = document.getElementById('endDate');

    // Check if both start date and duration are provided
    if (startDateInput.value && durationInput.value) {
        const startDate = new Date(startDateInput.value);
        const durationMonths = parseInt(durationInput.value, 10);

        // Validate that the start date is not in the past
        const today = new Date();
        if (startDate < today.setHours(0, 0, 0, 0)) {
            alert('The start date cannot be in the past.');
            startDateInput.value = ''; // Clear invalid start date
            endDateInput.value = ''; // Clear the end date
            return;
        }

        // Add the selected number of months to the start date
        startDate.setMonth(startDate.getMonth() + durationMonths);

        // Format the calculated end date as YYYY-MM-DD
        const formattedEndDate = startDate.toISOString().split('T')[0];

        // Set the calculated date in the end date input field
        endDateInput.value = formattedEndDate;
    } else {
        endDateInput.value = ''; // Clear the end date if inputs are incomplete
    }
}

document.querySelector('.return-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    window.location.href = 'landing.html'; // Redirect to HomePage
});

async function processInfo(event) {
    // Prevent the form from submitting if validation fails
    event.preventDefault();

    const durationInput = document.getElementById('membershipDuration');
    const endDateInput = document.getElementById('endDate');
    let gender = "";

    // Get form values
    const special = document.getElementById('txt1').value;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const phone = document.getElementById('phone').value;
    const countryCode = document.getElementById('countryCode').value;
    const startDateInput = document.getElementById('startDate').value;
    const fullPhoneNumber = countryCode + phone;
    const radios = document.getElementsByName('gender');

    // Country-specific phone number patterns
    const countryPhonePatterns = {
        '+972': /^0?5\d{8}$/,       // Israel: 
        '+1': /^[2-9]\d{9}$/,       // USA: 
        '+44': /^[1-9]\d{9}$/,      // UK: 
        '+91': /^[6-9]\d{9}$/,      // India: 
        '+61': /^[4]\d{8}$/         // Australia:
    };

    // Check if the required fields are filled
    if (!fname || !lname || !phone || !(radios[0].checked || radios[1].checked)) {
        alert('Please fill in all required fields or select a gender!');
        return;  // Stop here and prevent form submission
    }

    const phonePattern = countryPhonePatterns[countryCode];
    if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number in the correct format');
        return;
    }

    if (document.getElementById('male').checked) {
        gender = "Male";
    } else {
        gender = "Female";
    }

    if (!startDateInput) {
        alert('Please select a valid start date.');
        return;
    }

    // Prepare the form data to be saved
    const formData = {
        firstName: fname,
        lastName: lname,
        phone: fullPhoneNumber,
        startDate: startDateInput,
        membershipDuration: durationInput.value,
        endDate: endDateInput.value,
        specialRequest: special,
        gender: gender
    };

    console.log("Form data to be saved:", formData); // Log the form data

    // Save the form data to AWS S3
    const isSaved = await saveMemberData(formData);
    if (isSaved) {
        alert('Form submitted successfully!');
        window.location.href = 'gym-tutorials.html'; // Redirect after successful submission
    } else {
        alert('Failed to save form data. Please try again.');
    }
}

// Attach event listener to form
document.getElementById('gymForm').addEventListener('submit', processInfo);