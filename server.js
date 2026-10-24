require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Meta webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Incoming Instagram webhook events
app.post("/webhook", (req, res) => {
  const body = req.body;

  console.log("Webhook event received");

  // Acknowledge the event promptly.
  res.sendStatus(200);

  // Inspect the payload shape during development.
  // Avoid logging message contents or personal data in production.
  if (body.object) {
    console.log("Event object:", body.object);
    console.log(
      "Entry count:",
      Array.isArray(body.entry) ? body.entry.length : 0
    );
  }
});

app.get("/", (req, res) => {
  res.send("Instagram assistant server is running.");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
