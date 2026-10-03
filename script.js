// ========================================
// 1. DATA (the "source of truth")
// ========================================

// Every ticket lives in this array. The screen is always drawn FROM this array.
// Sample tickets so you can test without typing. To start empty, change to: const tickets = [];
const tickets = [
    {
        id: 1024,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        title: "Payment failed",
        category: "billing",
        priority: "high",
        description: "5000 rupees was deducted from my account but my order was not created.",
        status: "open"
    },
    {
        id: 1025,
        name: "Priya Patel",
        email: "priya@gmail.com",
        title: "Can't reset password",
        category: "account",
        priority: "medium",
        description: "The reset link in the email says it has expired.",
        status: "in-progress"
    },
    {
        id: 1026,
        name: "Amit Kumar",
        email: "amit@gmail.com",
        title: "Add dark mode",
        category: "feature",
        priority: "low",
        description: "It would be great to have a dark theme for night use.",
        status: "resolved"
    },
    {
        id: 1027,
        name: "Sneha Gupta",
        email: "sneha@gmail.com",
        title: "App crashes on checkout",
        category: "technical",
        priority: "critical",
        description: "The app shows an error and closes when I press Pay.",
        status: "open"
    }
];

// The id the NEXT new ticket will get
let ticketId = 1028;

// The ticket currently being edited (null means we are creating a new one)
let editingTicket = null;


// ========================================
// 2. LOOKUP TABLES
// ========================================

// All available statuses (used to build the dropdown)
const statuses = ["open", "in-progress", "resolved", "closed"];

// Status value -> CSS class
const statusClassMap = {
    open: "open",
    "in-progress": "progress",
    resolved: "resolved",
    closed: "closed"
};

// Status value -> text shown on screen
const statusTextMap = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
    closed: "Closed"
};

// Category value -> text shown on screen
const categoryTextMap = {
    technical: "Technical",
    billing: "Billing",
    account: "Account",
    feature: "Feature Request",
    other: "Other"
};

// Priority value -> text shown on screen
const priorityTextMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical"
};


// ========================================
// 3. GET HTML ELEMENTS
// ========================================

const form = document.querySelector("form");

// The empty <div class="ticket-list"> where tickets get drawn
const ticketList = document.querySelector(".ticket-list");

// Search box and the three filter dropdowns
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const priorityFilter = document.querySelector("#priorityFilter");
const categoryFilter = document.querySelector("#categoryFilter");


// ========================================
// 4. HELPER: CREATE AN ELEMENT WITH TEXT
// ========================================

// Makes one element, gives it a CSS class, and sets its text.
// textContent is used (not innerHTML) so user input can never inject HTML.
function createTextElement(tag, className, text) {

    const element = document.createElement(tag);

    element.classList.add(className);

    element.textContent = text;

    return element;

}


// ========================================
// 5. BUILD ONE TICKET CARD
// ========================================

// Takes one ticket object and RETURNS a finished card.
// It does not put the card on the page. renderTickets() does that.
function createTicketElement(ticket) {

    // Main card
    const ticketElement = document.createElement("div");

    ticketElement.classList.add("ticket");


    // Left side: ticket details
    const ticketInfo = document.createElement("div");

    ticketInfo.classList.add("ticket-info");

    ticketInfo.appendChild(
        createTextElement("h3", "ticket-title", ticket.title)
    );

    ticketInfo.appendChild(
        createTextElement("p", "ticket-category", categoryTextMap[ticket.category])
    );

    ticketInfo.appendChild(
        createTextElement("p", "ticket-priority", priorityTextMap[ticket.priority])
    );

    ticketInfo.appendChild(
        createTextElement("p", "ticket-name", ticket.name)
    );

    ticketInfo.appendChild(
        createTextElement("p", "ticket-email", ticket.email)
    );

    ticketInfo.appendChild(
        createTextElement("p", "ticket-description", ticket.description)
    );

    ticketElement.appendChild(ticketInfo);


    // Right side: id, buttons, status
    const ticketMeta = document.createElement("div");

    ticketMeta.classList.add("ticket-meta");

    ticketMeta.appendChild(
        createTextElement("p", "ticket-id", `#${ticket.id}`)
    );


    // ---------- EDIT BUTTON ----------
    const editButton = createTextElement("button", "edit-button", "Edit");

    editButton.addEventListener("click", function () {

        // Remember which ticket we are editing
        editingTicket = ticket;

        // Fill the form with this ticket's data
        document.querySelector("#name").value = ticket.name;
        document.querySelector("#email").value = ticket.email;
        document.querySelector("#title").value = ticket.title;
        document.querySelector("#category").value = ticket.category;
        document.querySelector("#priority").value = ticket.priority;
        document.querySelector("#description").value = ticket.description;

        // Scroll up so the form is visible
        form.scrollIntoView({ behavior: "smooth" });

    });

    ticketMeta.appendChild(editButton);


    // ---------- DELETE BUTTON ----------
    const deleteButton = createTextElement("button", "delete-button", "Delete");

    deleteButton.addEventListener("click", function () {

        // 1. Change the DATA
        const ticketIndex = tickets.indexOf(ticket);

        tickets.splice(ticketIndex, 1);

        // If we were editing this ticket, leave edit mode
        if (editingTicket === ticket) {

            editingTicket = null;

            form.reset();

        }

        // 2. Redraw the SCREEN from the data
        renderTickets(tickets);

    });

    ticketMeta.appendChild(deleteButton);


    // ---------- STATUS BADGE ----------
    const statusElement = document.createElement("span");

    statusElement.classList.add(
        "ticket-status",
        "status",
        statusClassMap[ticket.status]
    );

    statusElement.textContent = statusTextMap[ticket.status];

    ticketMeta.appendChild(statusElement);


    // ---------- STATUS DROPDOWN ----------
    const statusSelect = document.createElement("select");

    statusSelect.classList.add("status-select");

    // Build one <option> for each status using a loop
    statuses.forEach(function (status) {

        const option = document.createElement("option");

        option.value = status;

        option.textContent = statusTextMap[status];

        statusSelect.appendChild(option);

    });

    // Show the ticket's current status
    statusSelect.value = ticket.status;

    statusSelect.addEventListener("change", function () {

        // 1. Change the DATA
        ticket.status = statusSelect.value;

        // 2. Redraw the SCREEN from the data
        renderTickets(tickets);

    });

    ticketMeta.appendChild(statusSelect);


    ticketElement.appendChild(ticketMeta);

    return ticketElement;

}


// ========================================
// 6. RENDER A LIST OF TICKETS
// ========================================

// THE KEY FUNCTION.
// Give it ANY list of tickets. It clears the screen and draws exactly that list.
// Search and filters pass it a smaller list.
function renderTickets(list) {

    // Clear everything currently shown
    ticketList.innerHTML = "";

    // Nothing to show
    if (list.length === 0) {

        ticketList.appendChild(
            createTextElement(
                "p",
                "empty-message",
                "No tickets yet. Create your first ticket above."
            )
        );

        return;

    }

    // Draw one card per ticket
    list.forEach(function (ticket) {

        ticketList.appendChild(createTicketElement(ticket));

    });

}


// ========================================
// 7. FORM SUBMISSION
// ========================================

form.addEventListener("submit", function (event) {

    // Stop the page from refreshing
    event.preventDefault();

    // Read the form values
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const title = document.querySelector("#title").value.trim();
    const category = document.querySelector("#category").value;
    const priority = document.querySelector("#priority").value;
    const description = document.querySelector("#description").value.trim();


    // ---------- EDIT AN EXISTING TICKET ----------
    if (editingTicket) {

        // Change the DATA
        editingTicket.name = name;
        editingTicket.email = email;
        editingTicket.title = title;
        editingTicket.category = category;
        editingTicket.priority = priority;
        editingTicket.description = description;

        // Leave edit mode
        editingTicket = null;

        form.reset();

        // Redraw the SCREEN
        renderTickets(tickets);

        return;

    }


    // ---------- CREATE A NEW TICKET ----------
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

    ticketId++;

    // Change the DATA
    tickets.push(ticket);

    // Redraw the SCREEN
    renderTickets(tickets);

    form.reset();

});


// ========================================
// 8. FIRST DRAW WHEN THE PAGE LOADS
// ========================================

renderTickets(tickets);


// ========================================
// 9. LIVE SEARCH
// ========================================

searchInput.addEventListener("input", function () {

    // What the user typed, in lowercase
    const searchText = searchInput.value.toLowerCase();

    // Keep only the tickets that contain that text
    const matchingTickets = tickets.filter(function (ticket) {

        return (
            ticket.title.toLowerCase().includes(searchText) ||
            ticket.name.toLowerCase().includes(searchText) ||
            ticket.email.toLowerCase().includes(searchText) ||
            ticket.description.toLowerCase().includes(searchText)
        );

    });

    // Draw only those tickets
    renderTickets(matchingTickets);

});


// ========================================
// 10. DROPDOWN FILTERS (each works alone for now)
// ========================================

// ---------- STATUS FILTER ----------
statusFilter.addEventListener("change", function () {

    const selected = statusFilter.value;

    // "all" means show everything
    if (selected === "all") {

        renderTickets(tickets);

        return;

    }

    const matchingTickets = tickets.filter(function (ticket) {

        return ticket.status === selected;

    });

    renderTickets(matchingTickets);

});


// ---------- PRIORITY FILTER ----------
priorityFilter.addEventListener("change", function () {

    const selected = priorityFilter.value;

    if (selected === "all") {

        renderTickets(tickets);

        return;

    }

    const matchingTickets = tickets.filter(function (ticket) {

        return ticket.priority === selected;

    });

    renderTickets(matchingTickets);

});


// ---------- CATEGORY FILTER ----------
categoryFilter.addEventListener("change", function () {

    const selected = categoryFilter.value;

    if (selected === "all") {

        renderTickets(tickets);

        return;

    }

    const matchingTickets = tickets.filter(function (ticket) {

        return ticket.category === selected;

    });

    renderTickets(matchingTickets);

});