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

// The four numbers in the stat cards
const totalCount = document.querySelector("#totalCount");
const openCount = document.querySelector("#openCount");
const progressCount = document.querySelector("#progressCount");
const resolvedCount = document.querySelector("#resolvedCount");


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

        // 2. Redraw the SCREEN (keeping the current search and filters)
        applyFilters();

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

        // 2. Redraw the SCREEN (keeping the current search and filters)
        applyFilters();

    });

    ticketMeta.appendChild(statusSelect);


    ticketElement.appendChild(ticketMeta);

    return ticketElement;

}


// ========================================
// 6. RENDER A LIST OF TICKETS
// ========================================

// Give it ANY list of tickets. It clears the screen and draws exactly that list.
function renderTickets(list) {

    // Clear everything currently shown
    ticketList.innerHTML = "";

    // Nothing to show
    if (list.length === 0) {

        // Two different reasons for an empty list
        const message = tickets.length === 0
            ? "No tickets yet. Create your first ticket above."
            : "No tickets found. Try changing your search or filters.";

        ticketList.appendChild(
            createTextElement("p", "empty-message", message)
        );

        return;

    }

    // Draw one card per ticket
    list.forEach(function (ticket) {

        ticketList.appendChild(createTicketElement(ticket));

    });

}


// ========================================
// 7. SEARCH + FILTERS TOGETHER
// ========================================

// It reads the search box and all three dropdowns, keeps only the tickets
// that match ALL of them, and draws the result.
// Every change (typing, picking a dropdown, creating, deleting) calls this.
function applyFilters() {

    // What the user typed / picked right now
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;
    const selectedCategory = categoryFilter.value;

    const matchingTickets = tickets.filter(function (ticket) {

        // Does the search text appear in any of these fields?
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchText) ||
            ticket.name.toLowerCase().includes(searchText) ||
            ticket.email.toLowerCase().includes(searchText) ||
            ticket.description.toLowerCase().includes(searchText);

        // "all" means this dropdown does not filter anything
        const matchesStatus =
            selectedStatus === "all" || ticket.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "all" || ticket.priority === selectedPriority;

        const matchesCategory =
            selectedCategory === "all" || ticket.category === selectedCategory;

        // The ticket stays only if ALL four checks pass
        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;

    });

    renderTickets(matchingTickets);
    updateStats();

}

// ========================================
// 7B. DASHBOARD STATS
// ========================================

// Counts ALL tickets (not just the filtered ones) and updates the four cards.
function updateStats() {

    totalCount.textContent = tickets.length;

    openCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "open";
    }).length;

    progressCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "in-progress";
    }).length;

    resolvedCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "resolved";
    }).length;

}

// ========================================
// 8. FORM SUBMISSION
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
        applyFilters();

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
    applyFilters();

    form.reset();

});


// ========================================
// 9. LISTEN FOR SEARCH AND FILTER CHANGES
// ========================================

// Typing in the search box
searchInput.addEventListener("input", applyFilters);

// Picking something in any dropdown
statusFilter.addEventListener("change", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);


// ========================================
// 10. FIRST DRAW WHEN THE PAGE LOADS
// ========================================

applyFilters();