/**
 * Dynamically creates and appends option buttons to the options container.
 * Each button represents an option from the predefined list and
 * has an event listener to toggle the 'active' class upon clicking.
 */

function triggerOptions() {
    const options = ["Golang", "JavaScript", "TypeScript", "Frontend", "Backend", "Full Stack"];
    const container = document.getElementById("optionsContainer");

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => {
            document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("active"));
            btn.classList.add("active");
        });
        container.appendChild(btn);
    });
}

/**
* Updates the text content of the first child node within the element 
* with class "option-box" to the provided new text.
*
* @param {string} newText - The new text to be displayed in the option box.
*/

function updateDialogText(newText) {
    document.querySelector(".option-box").firstChild.nodeValue = newText;
}

/**
 * Sets the display property of the element with class "option-box" to empty string (''),
 * effectively making it visible.
 */
function openOptionBox() {
    document.querySelector(".option-box").style.display = '';
    triggerOptions();
    updateDialogText(`Hi, I'm Taufiq, a software engineer with experience in various technologies.
        Select your area of interest:`);
}