const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set default host and port, and get values from environment variables if available
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 10000;

const app = express();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Create the uploads folder if it doesn't exist
    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.status(200).send('File uploaded successfully');
  } else {
    res.status(400).send('File upload failed');
  }
});

// GET endpoint to retrieve a file
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, host, () => {
  console.log(`File upload app listening at http://${host}:${port}`);
});
