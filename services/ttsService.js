
const axios = require("axios");

const generateSpeech = async (text) => {

    try {

        console.log("\n=================================");
        console.log("FISH AUDIO TTS START");
        console.log("=================================");

        console.log("Text:", text);

        console.log(
            "API KEY:",
            process.env.FISH_API_KEY
                ? "LOADED"
                : "NOT LOADED"
        );

        console.log(
            "VOICE ID:",
            process.env.FISH_VOICE_ID
                ? process.env.FISH_VOICE_ID
                : "NOT LOADED"
        );


        // ==========================================
        // ENV CHECK
        // ==========================================

        if (!process.env.FISH_API_KEY) {

            console.error(
                "❌ FISH_API_KEY is missing."
            );

            return null;
        }


        if (!process.env.FISH_VOICE_ID) {

            console.error(
                "❌ FISH_VOICE_ID is missing."
            );

            return null;
        }


        // ==========================================
        // FISH AUDIO REQUEST
        // ==========================================

        const response = await axios.post(

            "https://api.fish.audio/v1/tts",

            {
                text: text,

                reference_id:
                    process.env.FISH_VOICE_ID,

                format: "mp3",
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${process.env.FISH_API_KEY}`,

                    "Content-Type":
                        "application/json",

                    // IMPORTANT:
                    // Free S2.1 Pro model
                    model:
                        "s2.1-pro-free",
                },

                responseType:
                    "arraybuffer",

                timeout:
                    60000,
            }
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        console.log(
            "FISH AUDIO HTTP STATUS:",
            response.status
        );


        if (
            !response.data ||
            response.data.length === 0
        ) {

            console.error(
                "❌ Fish Audio returned empty audio."
            );

            return null;
        }


        // ==========================================
        // BUFFER → BASE64
        // ==========================================

        const audioBase64 =
            Buffer
                .from(response.data)
                .toString("base64");


        if (!audioBase64) {

            console.error(
                "❌ Audio conversion failed."
            );

            return null;
        }


        console.log(
            "✅ Fish Audio generated successfully."
        );

        console.log(
            "Audio bytes:",
            response.data.length
        );

        console.log(
            "Base64 length:",
            audioBase64.length
        );

        console.log(
            "=================================\n"
        );


        return audioBase64;


    } catch (error) {

        console.error(
            "\n================================="
        );

        console.error(
            "❌ FISH AUDIO TTS ERROR"
        );

        console.error(
            "================================="
        );


        if (error.response) {

            console.error(
                "HTTP STATUS:",
                error.response.status
            );


            try {

                const errorText =
                    Buffer
                        .from(
                            error.response.data
                        )
                        .toString("utf8");

                console.error(
                    "FISH AUDIO ERROR:",
                    errorText
                );

            } catch {

                console.error(
                    "Unable to read Fish Audio error."
                );

            }

        } else {

            console.error(
                "ERROR:",
                error.message
            );

        }


        console.error(
            "=================================\n"
        );


        return null;
    }
};


module.exports = generateSpeech;
