const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

let db;

(async () => {
  db = await open({
    filename: process.env.DATABASE_FILE || 'leads.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      company TEXT,
      bundle TEXT,
      addons TEXT,
      mrr REAL,
      setup_fee REAL,
      agreement BOOLEAN,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

const transporter = nodemailer.createTransport({
  host: 'smtp.techtoyoullc.com', // Replace with actual SMTP host
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/leads', async (req, res) => {
  const { name, email, company, bundle, addons, mrr, setup_fee, agreement } = req.body;
  
  try {
    const result = await db.run(
      `INSERT INTO leads (name, email, company, bundle, addons, mrr, setup_fee, agreement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, company, bundle, JSON.stringify(addons), mrr, setup_fee, agreement]
    );
    
    const leadId = result.lastID;

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ALERTS,
      cc: process.env.EMAIL_TO,
      subject: `🎫 TICKETING: New Workplace Solution Lead - ${company}`,
      text: `
        INTERNAL INFRASTRUCTURE ALERT: New Lead Submission
        
        Lead Details:
        --------------------------------------------------
        Company: ${company}
        Name: ${name}
        Email: ${email}
        Bundle: ${bundle}
        MRR: $${mrr}
        Setup Fee: $${setup_fee}
        Agreement: ${agreement ? '24-Month' : 'Upfront'}
        Add-ons: ${JSON.stringify(addons)}
        
        Lead ID: ${leadId}
        Timestamp: ${new Date().toISOString()}
        --------------------------------------------------
        
        Please initialize onboarding workflow for this client.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, id: leadId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to store lead' });
  }
});

app.get('/api/admin/leads', async (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const leads = await db.all('SELECT * FROM leads ORDER BY timestamp DESC');
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  
  try {
    const response = await axios.post(`${process.env.OPENWEBUI_URL}/chat/completions`, {
      model: 'gpt-4o', // Replace with the specific model ID used in OpenWebUI
      messages: messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENWEBUI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Chat Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to connect to AI architect' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
