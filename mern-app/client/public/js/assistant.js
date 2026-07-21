async function sendMessage() {

    const input = document.getElementById("message");
    const button = document.querySelector("button");

    const msg = input.value.trim();

    if (!msg) return;

    const box = document.getElementById("chat-box");

    // User Message
    box.innerHTML += `
        <div class="text-end mb-3">
            <div class="d-inline-block bg-success text-white rounded p-2">
                <strong>You</strong><br>
                ${msg}
            </div>
        </div>
    `;

    input.value = "";

    // Disable while waiting
    input.disabled = true;
    button.disabled = true;

    // Loading Animation
    const loadingId = "loading-" + Date.now();

    box.innerHTML += `
        <div id="${loadingId}" class="mb-3">
            <div class="d-inline-block bg-light border rounded p-2">
                <strong>🤖 OptiCrop AI</strong><br>
                <span class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                Thinking...
            </div>
        </div>
    `;

    box.scrollTop = box.scrollHeight;

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: msg
            })
        });

        const data = await response.json();

        // Remove loading animation
        document.getElementById(loadingId)?.remove();

        // AI Response
        box.innerHTML += `
            <div class="mb-3">
                <div class="d-inline-block bg-light border rounded p-3">
                    <strong>🤖 OptiCrop AI</strong><br><br>
                    ${data.reply.replace(/\n/g, "<br>")}
                </div>
            </div>
        `;

    } catch (err) {

        document.getElementById(loadingId)?.remove();

        box.innerHTML += `
            <div class="alert alert-danger">
                Error: ${err}
            </div>
        `;
    }

    input.disabled = false;
    button.disabled = false;
    input.focus();

    box.scrollTop = box.scrollHeight;
}


// Press Enter to Send
document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("message");

    input.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }

    });

});