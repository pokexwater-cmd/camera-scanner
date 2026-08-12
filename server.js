const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow big base64 images
app.use(express.static('public'));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body; // base64 string, no data: prefix
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Identify what is in this image. Give a short title (a few words), then 2-3 sentences describing it. Be specific and confident.'
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: image
                }
              }
            ]
          }
        ]
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No description returned.';
    res.json({ description: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong analyzing the image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
