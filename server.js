
const dotenv = require("dotenv");

dotenv.config({
    path: "./.env",
});


console.log(
    "GROQ KEY:",
    process.env.GROQ_API_KEY
        ? "LOADED"
        : "NOT LOADED"
);

console.log(
    "MINIMAX KEY:",
    process.env.MINIMAX_API_KEY
        ? "LOADED"
        : "NOT LOADED"
);

console.log(
    "MINIMAX VOICE:",
    process.env.MINIMAX_VOICE_ID
        ? "LOADED"
        : "NOT LOADED"
);


const express = require("express");
const cors = require("cors");
const path = require("path");


const handleCommand =
    require("./commands/commandHandler");


const askAI =
    require("./services/aiService");


const generateSpeech =
    require("./services/ttsService");


const app = express();


const cors = require("cors");

app.use(
  cors({
    origin: "https://personal-ai-assitant-oy1y.onrender.com/voice",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
    express.json({
        limit: "2mb",
    })
);


/*
==========================================
              VOICE WEBSITE
==========================================
*/

app.use(
    "/voice",
    express.static(
        path.join(__dirname, "voice")
    )
);


/*
==========================================
                  HOME
==========================================
*/

app.get("/", (req, res) => {

    res.json({

        success: true,

        assistant: "JARVIS",

        status: "online",

        message:
            "JARVIS is online.",

    });

});


/*
==========================================
              JARVIS API
==========================================
*/

app.post(
    "/api/jarvis",
    async (req, res) => {

        try {

            const {
                command
            } = req.body;


            console.log(
                "================================="
            );

            console.log(
                "JARVIS REQUEST:",
                command
            );


            /*
            ======================================
                    VALIDATE COMMAND
            ======================================
            */

            if (!command) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Command is required.",

                });

            }


            /*
            ======================================
                  CHECK LOCAL COMMAND
            ======================================
            */

            const localCommand =
                handleCommand(command);


            console.log(
                "Local command:",
                localCommand
            );


            /*
            ======================================
                 LOCAL COMMAND RESPONSE
            ======================================
            */

            if (
                localCommand &&
                localCommand.handled === true
            ) {

                const responseText =
                    localCommand.response;


                console.log(
                    "Local response:",
                    responseText
                );


                /*
                ==================================
                    GENERATE MINIMAX VOICE
                ==================================
                */

                console.log(
                    "Generating JARVIS voice..."
                );


                const audio =
                    await generateSpeech(
                        responseText
                    );


                console.log(
                    "Voice generated:",
                    audio
                        ? "YES"
                        : "NO"
                );


                return res.json({

                    success: true,

                    source: "command",

                    command,

                    response:
                        responseText,

                    audio:
                        audio || null,

                });

            }


            /*
            ======================================
                    GROQ AI RESPONSE
            ======================================
            */

            console.log(
                "Sending command to Groq..."
            );


            const aiResponse =
                await askAI(command);


            console.log(
                "Groq response:",
                aiResponse
            );


            /*
            ======================================
                 GROQ RESPONSE FAILED
            ======================================
            */

            if (!aiResponse) {

                const fallback =
                    "I'm unable to connect to my AI system right now.";


                /*
                Generate voice for fallback
                */

                const audio =
                    await generateSpeech(
                        fallback
                    );


                return res.json({

                    success: false,

                    source: "ai",

                    command,

                    response:
                        fallback,

                    audio:
                        audio || null,

                });

            }


            /*
            ======================================
                 GENERATE MINIMAX VOICE
            ======================================
            */

            console.log(
                "Generating JARVIS voice from Groq response..."
            );


            const audio =
                await generateSpeech(
                    aiResponse
                );


            console.log(
                "Voice generated:",
                audio
                    ? "YES"
                    : "NO"
            );


            /*
            ======================================
                    FINAL RESPONSE
            ======================================
            */

            return res.json({

                success: true,

                source: "ai",

                command,

                response:
                    aiResponse,

                audio:
                    audio || null,

            });


        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "JARVIS SERVER ERROR:"
            );

            console.error(
                error
            );

            console.error(
                "================================="
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error.",

                response:
                    "Something went wrong in my main system.",

                audio: null,

            });

        }

    }
);


/*
==========================================
                  SERVER
==========================================
*/

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(`

╔══════════════════════════════════╗
║          J.A.R.V.I.S             ║
║      Personal AI Assistant       ║
╠══════════════════════════════════╣
║ Status : ONLINE                  ║
║ Port   : ${PORT}                 ║
║ AI     : GROQ                    ║
║ Voice  : MINIMAX                 ║
╚══════════════════════════════════╝

        `);

    }
);
