// ========================================
// 1. CREATE TICKET STORAGE
// ========================================

// Create an empty array to store all tickets
const tickets = [];

// TO give the unique ticket id to every ticket 
let ticketId = 1024;

const statuses = ["open", "in-progress", "resolved", "closed"];


// ========================================
// 2. GET HTML ELEMENTS
// ========================================

// Get the form from the HTML
const form = document.querySelector("form");

// Get the Recent Tickets section from the HTML
const recentTickets = document.querySelector(".recent-tickets");


// ========================================
// 3. LISTEN FOR FORM SUBMISSION
// ========================================

// Run this function when the form is submitted
form.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();


    // ========================================
    // 4. GET DATA FROM THE FORM
    // ========================================

    // Get the name entered by the user
    const name = document.querySelector("#name").value;
    console.log(name);

    // Get the email entered by the user
    const email = document.querySelector("#email").value;
    console.log(email);

    // Get the issue title entered by the user
    const title = document.querySelector("#title").value;
    console.log(title);

    // Get the selected category
    const category = document.querySelector("#category").value;
    console.log(category);

    // Get the selected priority
    const priority = document.querySelector("#priority").value;
    console.log(priority);

    // Get the issue description
    const description = document.querySelector("#description").value;
    console.log(description);


    // ========================================
    // 5. CREATE THE TICKET OBJECT
    // ========================================

    // Store all the form data inside one ticket object
    const ticket = {
        id: ticketId,
        name: name,
        email: email,
        title: title,
        category: category,
        priority: priority,
        description: description,
        status: "open"
    };

    // Increase the ticket ID for the next ticket
    ticketId++;
    // Display the ticket object in the console
    console.log(ticket);


    // ========================================
    // 6. STORE THE TICKET
    // ========================================

    // Add the ticket object to the tickets array
    tickets.push(ticket);

    // Display all stored tickets in the console
    console.log(tickets);


    // ========================================
    // 7. CREATE A TICKET ELEMENT
    // ========================================

    // Create an empty <div> element for the ticket
    const ticketElement = document.createElement("div");

    const ticketMeta = document.createElement("div");

    ticketMeta.classList.add("ticket-meta");

    // Create a container for the ticket information
    const ticketInfo = document.createElement("div");

    ticketInfo.classList.add("ticket-info");

    ticketElement.appendChild(ticketInfo);

    // ========================================
    // 8. CREATE THE TITLE ELEMENT
    // ========================================

    // Create an empty <h3> element
    const titleElement = document.createElement("h3");

    titleElement.classList.add("ticket-title");

    // Put the ticket title inside the <h3>
    titleElement.textContent = ticket.title;

    ticketInfo.appendChild(titleElement);


    // CATEGORY
    const categoryElement = document.createElement("p");

    categoryElement.classList.add("ticket-category");

    categoryElement.textContent = ticket.category;

    ticketInfo.appendChild(categoryElement);

    // PRIORITY

    // Create an empty <p> element
    const priorityElement = document.createElement("p");

    priorityElement.classList.add("ticket-priority");

    // Put the ticket priority inside the <p>
    priorityElement.textContent = ticket.priority;

    // Put the <p> inside the ticket info <div>
    ticketInfo.appendChild(priorityElement);

    // NAME

    // Create an empty <p> element
    const nameElement = document.createElement("p");

    nameElement.classList.add("ticket-name");

    // Put the ticket name inside the <p>
    nameElement.textContent = ticket.name;

    // Put the <p> inside the ticket <div>
    ticketInfo.appendChild(nameElement);


    // EMAIL

    // Create an empty <p> element
    const emailElement = document.createElement("p");

    emailElement.classList.add("ticket-email");

    // Put the ticket email inside the <p>
    emailElement.textContent = ticket.email;

    // Put the <p> inside the ticket info <div>
    ticketInfo.appendChild(emailElement);


    // DESCRIPTION

    // Create an empty <p> element
    const descriptionElement = document.createElement("p");

    descriptionElement.classList.add("ticket-description");

    // Put the ticket description inside the <p>
    descriptionElement.textContent = ticket.description;

    // Put the <p> inside the ticket <div>
    ticketInfo.appendChild(descriptionElement);

    // TICKET ID

    // Create an empty <p> element
    const idElement = document.createElement("p");

    idElement.classList.add("ticket-id");

    // Put the ticket ID inside the <p>
    idElement.textContent = `#${ticket.id}`;

    // Put the <p> inside the info container <div>
    ticketMeta.appendChild(idElement);


    // STATUS

    // Create an empty <span> element
    const statusElement = document.createElement("span");

    statusElement.classList.add("ticket-status");

    // Put "Open" inside the <span>
    statusElement.textContent = ticket.status;

    // Create the status selector
    const statusSelect = document.createElement("select");


    // Create Open option
    const openOption = document.createElement("option");
    openOption.value = "open";
    openOption.textContent = "Open";


    // Create In Progress option
    const progressOption = document.createElement("option");
    progressOption.value = "in-progress";
    progressOption.textContent = "In Progress";


    // Create Resolved option
    const resolvedOption = document.createElement("option");
    resolvedOption.value = "resolved";
    resolvedOption.textContent = "Resolved";


    // Create Closed option
    const closedOption = document.createElement("option");
    closedOption.value = "closed";
    closedOption.textContent = "Closed";

    // ADD THE OPTIONS TO THE SELECT
    statusSelect.appendChild(openOption);
    statusSelect.appendChild(progressOption);
    statusSelect.appendChild(resolvedOption);
    statusSelect.appendChild(closedOption);

    // Set the dropdown to the ticket's current status
    statusSelect.value = ticket.status;

    // To add the both classes alreday written to get the css work done 
    statusElement.classList.add("status", ticket.status);

    // Put the <span> inside the ticket <div>
    ticketMeta.appendChild(statusElement);

    // Put the status selector inside the ticket meta container
    ticketMeta.appendChild(statusSelect);

    // Detect when the ticket status is changed
    statusSelect.addEventListener("change", function () {

        // Get the newly selected status
        const newStatus = statusSelect.value;

        console.log(newStatus);

    });

    // ========================================
    // 9. DISPLAY TICKET INFORMATION
    // ========================================

    // Display all ticket information inside the ticket <div>
    // ticketElement.textContent = `${ticket.name} - ${ticket.email} - ${ticket.title} - ${ticket.category} - ${ticket.priority} - ${ticket.description}`;


    // ========================================
    // 10. ADD CSS CLASS TO TICKET
    // ========================================

    // Add the "ticket" class so our CSS can style it
    ticketElement.classList.add("ticket");


    // ========================================
    // 11. ADD TICKET TO THE WEBPAGE
    // ========================================

    // Add the ticket element inside Recent Tickets
    ticketElement.appendChild(ticketMeta);
    recentTickets.appendChild(ticketElement);

    // Clear the form after creating the ticket
    form.reset();



});

