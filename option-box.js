/**
 * Dynamically creates and appends option buttons to the options container.
 * Each button represents an option from the predefined list and
 * has an event listener to toggle the 'active' class upon clicking.
 */

function triggerOptions() {
    // {
    //     name: "CV",
    //     actions: [
    //         {
    //             type: "download",
    //             url: ".Taufiqurrahman Hafiidh Datau/CV.pdf"
    //         }
    //     ]
    // }
    const options = [
        {
            name: "Resume",
            actions: [
                {
                    action: "download",
                    url: "./file/Taufiqurrahman Hafiidh Datau CV.pdf"
                },
                {
                    action: "talking",
                    text: `This is my updated CV`,
                    fn: textBox.StartDialogue.bind(textBox),
                    character: './img/nipon.gif',
                },
                {
                    action: "talking",
                    text: `What do you want to know more about me?`,
                    fn: textBox.StartDialogue.bind(textBox),
                    character: './img/nipon.gif',
                },
                {
                    action: "options",
                    text: "what do you want to do next?",
                    fn: openOptionBox,
                }
            ]
        },
        {
            name: "Close",
            actions: [
                {
                    action: "close",
                    fn: closeOptionBox
                },
                {
                    action: "talking",
                    text: `Thank you for youre interest`,
                    fn: textBox.StartDialogue.bind(textBox),
                    character: './img/nipon.gif',
                }
            ]
        }
    ];
    const container = document.getElementById("optionsContainer");
    container.innerHTML = "";

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option.name;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => {
            document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("active"));
            btn.classList.add("active");
            option.actions.forEach(action => {
                actionQueue.push(action);
            });
            dispatchEvent();
            closeOptionBox();
            dispatchEvent();
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
function openOptionBox(text) {
    document.querySelector(".option-box").style.display = '';
    triggerOptions();
    updateDialogText(text);
}

function closeOptionBox() {
    document.querySelector(".option-box").style.display = 'none';
}