
const handleCommand = (command) => {

    const text =
        command
            .toLowerCase()
            .trim();


    // ==============================
    // GREETING
    // ==============================

    if (
        text.includes("hello jarvis") ||
        text.includes("hey jarvis") ||
        text === "jarvis"
    ) {
        return {
            handled: true,
            response:
                "Hello Nilu. JARVIS is online and ready.",
        };
    }


    // ==============================
    // NAME
    // ==============================

    if (
        text.includes("your name") ||
        text.includes("what is your name")
    ) {
        return {
            handled: true,
            response:
                "My name is JARVIS. Just A Rather Very Intelligent System.",
        };
    }


    // ==============================
    // WHO ARE YOU
    // ==============================

    if (
        text.includes("who are you")
    ) {
        return {
            handled: true,
            response:
                "I am your personal AI assistant. I can help you with information, tasks and device control.",
        };
    }


    // ==============================
    // HOW ARE YOU
    // ==============================

    if (
        text.includes("how are you")
    ) {
        return {
            handled: true,
            response:
                "I'm functioning perfectly, Nilu. Thank you for asking.",
        };
    }


    // ==============================
    // GOOD MORNING
    // ==============================

    if (
        text.includes("good morning")
    ) {
        return {
            handled: true,
            response:
                "Good morning, Nilu. How can I assist you today?",
        };
    }


    // ==============================
    // GOOD NIGHT
    // ==============================

    if (
        text.includes("good night") ||
        text.includes("goodnight")
    ) {
        return {
            handled: true,
            response:
                "Good night, Nilu. I'll be here whenever you need me.",
        };
    }


    // ==============================
    // THANK YOU
    // ==============================

    if (
        text.includes("thank you") ||
        text.includes("thanks")
    ) {
        return {
            handled: true,
            response:
                "You're welcome, Nilu.",
        };
    }


    // ==============================
    // UNKNOWN COMMAND
    // ==============================

    return {
        handled: false,
        response: null,
    };
};


module.exports = handleCommand;
