/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
          nav = document.getElementById(navbarId);
    
    // Validate that elements exist in the DOM
    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            // Toggle the "show-menu" class on the navbar
            nav.classList.toggle('show-menu');
        });
    } else {
        console.warn("Navbar or Toggle button not found! Check your IDs.");
    }
};

// Example usage
showMenu("header-toggle", "navbar");

document.addEventListener("DOMContentLoaded", function () {
    const leftHeader = document.querySelector(".left-header");
    const rightHeader = document.querySelector(".right-header");
    const dropdown1 = document.querySelector(".dropdown-menu1");
    const dropdown2 = document.querySelector(".dropdown-menu2");

    if (leftHeader && rightHeader && dropdown1 && dropdown2) {
        leftHeader.addEventListener("click", function (event) {
            dropdown1.classList.toggle("show");
            dropdown2.classList.remove("show"); // Close right dropdown if open
            event.stopPropagation(); // Prevent immediate closing when clicking the button
        });

        rightHeader.addEventListener("click", function (event) {
            dropdown2.classList.toggle("show");
            dropdown1.classList.remove("show"); // Close left dropdown if open
            event.stopPropagation();
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (!leftHeader.contains(event.target) && !dropdown1.contains(event.target)) {
                dropdown1.classList.remove("show");
            }
            if (!rightHeader.contains(event.target) && !dropdown2.contains(event.target)) {
                dropdown2.classList.remove("show");
            }
        });
    } else {
        console.warn("One or more elements (headers or dropdowns) are missing!");
    }
});
