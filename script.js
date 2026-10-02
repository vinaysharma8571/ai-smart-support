// ========================================
// 1. CREATE TICKET STORAGE
// ========================================

// Create an empty array to store all tickets
const tickets = [];

// Give the unique ticket id to every ticket
let ticketId = 1024;

// Store the ticket currently being edited
let editingTicket = null;

// Store the DOM element of the ticket currently being edited
let editingTicketElement = null;


// ========================================
// AVAILABLE TICKET STATUSES
// ========================================

// Available ticket statuses
const statuses = ["open", "in-progress", "resolved", "closed"];


// ========================================
// STATUS CLASS MAP
// ========================================

// Convert internal status values to CSS classes
const statusClassMap = {
    open: "open",
    "in-progress": "progress",
    resolved: "resolved",
    closed: "closed"
};


// ========================================
// STATUS TEXT MAP
// ========================================

// Convert internal status values to display text
const statusTextMap = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
    closed: "Closed"
};


// ========================================
// 2. GET HTML ELEMENTS
// ========================================

// Get the form from the HTML
const form = document.querySelector("form");

// Get the Recent Tickets section from the HTML
const recentTickets = document.querySelector(".recent-tickets");

// Get the search input from the HTML
const searchInput = document.querySelector("#searchInput");


// ========================================
// 3. RENDER ONE TICKET
// ========================================

// This function creates one complete ticket card
function renderTicket(ticket) {

    // ========================================
    // CREATE MAIN TICKET ELEMENT
    // ========================================

    const ticketElement = document.createElement("div");

    ticketElement.classList.add("ticket");


    // ========================================
    // CREATE TICKET INFO CONTAINER
    // ========================================

    const ticketInfo = document.createElement("div");

    ticketInfo.classList.add("ticket-info");

    ticketElement.appendChild(ticketInfo);


    // ========================================
    // CREATE TICKET META CONTAINER
    // ========================================

    const ticketMeta = document.createElement("div");

    ticketMeta.classList.add("ticket-meta");

    ticketElement.appendChild(ticketMeta);


    // ========================================
    // TITLE
    // ========================================

    const ticketTitle = document.createElement("h3");

    ticketTitle.classList.add("ticket-title");

    ticketTitle.textContent = ticket.title;

    ticketInfo.appendChild(ticketTitle);


    // ========================================
    // CATEGORY
    // ========================================

    const ticketCategory = document.createElement("p");

    ticketCategory.classList.add("ticket-category");

    ticketCategory.textContent = ticket.category;

    ticketInfo.appendChild(ticketCategory);


    // ========================================
    // PRIORITY
    // ========================================

    const ticketPriority = document.createElement("p");

    ticketPriority.classList.add("ticket-priority");

    ticketPriority.textContent = ticket.priority;

    ticketInfo.appendChild(ticketPriority);


    // ========================================
    // NAME
    // ========================================

    const ticketName = document.createElement("p");

    ticketName.classList.add("ticket-name");

    ticketName.textContent = ticket.name;

    ticketInfo.appendChild(ticketName);


    // ========================================
    // EMAIL
    // ========================================

    const ticketEmail = document.createElement("p");

    ticketEmail.classList.add("ticket-email");

    ticketEmail.textContent = ticket.email;

    ticketInfo.appendChild(ticketEmail);


    // ========================================
    // DESCRIPTION
    // ========================================

    const ticketDescription = document.createElement("p");

    ticketDescription.classList.add("ticket-description");

    ticketDescription.textContent = ticket.description;

    ticketInfo.appendChild(ticketDescription);


    // ========================================
    // TICKET ID
    // ========================================

    const ticketIdElement = document.createElement("p");

    ticketIdElement.classList.add("ticket-id");

    ticketIdElement.textContent = `#${ticket.id}`;

    ticketMeta.appendChild(ticketIdElement);


    // ========================================
    // EDIT BUTTON
    // ========================================

    const editButton = document.createElement("button");

    editButton.textContent = "Edit";

    editButton.classList.add("edit-button");

    ticketMeta.appendChild(editButton);


    // Edit button functionality
    editButton.addEventListener("click", function () {

        editingTicket = ticket;

        editingTicketElement = ticketElement;


        document.querySelector("#name").value = ticket.name;

        document.querySelector("#email").value = ticket.email;

        document.querySelector("#title").value = ticket.title;

        document.querySelector("#category").value = ticket.category;

        document.querySelector("#priority").value = ticket.priority;

        document.querySelector("#description").value = ticket.description;

    });


    // ========================================
    // DELETE BUTTON
    // ========================================

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete-button");

    ticketMeta.appendChild(deleteButton);


    // Delete button functionality
    deleteButton.addEventListener("click", function () {

        const ticketIndex = tickets.indexOf(ticket);

        tickets.splice(ticketIndex, 1);

        ticketElement.remove();


        // Clear editing mode if this ticket
        // was currently being edited
        if (editingTicket === ticket) {

            editingTicket = null;

            editingTicketElement = null;

        }

    });


    // ========================================
    // STATUS BADGE
    // ========================================

    const statusElement = document.createElement("span");

    statusElement.classList.add("ticket-status");

    statusElement.classList.add(
        "status",
        statusClassMap[ticket.status]
    );

    statusElement.textContent = statusTextMap[ticket.status];

    ticketMeta.appendChild(statusElement);


    // ========================================
    // STATUS SELECT
    // ========================================

    const statusSelect = document.createElement("select");

    statusSelect.classList.add("status-select");


    // Open option
    const openOption = document.createElement("option");

    openOption.value = "open";

    openOption.textContent = "Open";

    statusSelect.appendChild(openOption);


    // In Progress option
    const progressOption = document.createElement("option");

    progressOption.value = "in-progress";

    progressOption.textContent = "In Progress";

    statusSelect.appendChild(progressOption);


    // Resolved option
    const resolvedOption = document.createElement("option");

    resolvedOption.value = "resolved";

    resolvedOption.textContent = "Resolved";

    statusSelect.appendChild(resolvedOption);


    // Closed option
    const closedOption = document.createElement("option");

    closedOption.value = "closed";

    closedOption.textContent = "Closed";

    statusSelect.appendChild(closedOption);


    // Set dropdown to current ticket status
    statusSelect.value = ticket.status;

    ticketMeta.appendChild(statusSelect);


    // ========================================
    // STATUS CHANGE
    // ========================================

    statusSelect.addEventListener("change", function () {

        // Get the newly selected status
        const newStatus = statusSelect.value;


        // Update the ticket object
        ticket.status = newStatus;


        // Update the visible status text
        statusElement.textContent = statusTextMap[newStatus];


        // Remove old status CSS classes
        statusElement.classList.remove(
            "open",
            "progress",
            "resolved",
            "closed"
        );


        // Add the correct CSS class
        statusElement.classList.add(
            statusClassMap[newStatus]
        );

    });


    // ========================================
    // ADD TICKET TO WEBPAGE
    // ========================================

    recentTickets.appendChild(ticketElement);

}


// ========================================
// 4. LISTEN FOR FORM SUBMISSION
// ========================================

// Run this function when the form is submitted
form.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();


    // ========================================
    // 5. GET DATA FROM THE FORM
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
    // 6. EDIT EXISTING TICKET
    // ========================================

    console.log("EDITING TICKET:", editingTicket);

    if (editingTicket) {

        editingTicket.name = name;

        editingTicket.email = email;

        editingTicket.title = title;

        editingTicket.category = category;

        editingTicket.priority = priority;

        editingTicket.description = description;


        // Update visible ticket information
        editingTicketElement.querySelector(
            ".ticket-title"
        ).textContent = title;

        editingTicketElement.querySelector(
            ".ticket-category"
        ).textContent = category;

        editingTicketElement.querySelector(
            ".ticket-priority"
        ).textContent = priority;

        editingTicketElement.querySelector(
            ".ticket-name"
        ).textContent = name;

        editingTicketElement.querySelector(
            ".ticket-email"
        ).textContent = email;

        editingTicketElement.querySelector(
            ".ticket-description"
        ).textContent = description;


        // Exit edit mode
        editingTicket = null;

        editingTicketElement = null;


        // Clear form
        form.reset();

        return;

    }


    // ========================================
    // 7. CREATE THE TICKET OBJECT
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
    // 8. STORE THE TICKET
    // ========================================

    // Add the ticket object to the tickets array
    tickets.push(ticket);


    // ========================================
    // 9. DISPLAY THE TICKET
    // ========================================

    renderTicket(ticket);


    // Display all stored tickets in the console
    console.log(tickets);


    // ========================================
    // 10. CLEAR THE FORM
    // ========================================

    form.reset();

});