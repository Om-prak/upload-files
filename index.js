const express = require('express');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  // Views directory

// Set up file storage options using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in the 'uploads' directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Ensure unique filenames by appending timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up the multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).array('files', 10);  // 'files' is the field name and max 10 files

// Serve static files (e.g., for accessing uploaded images, etc.)
app.use('/uploads', express.static('uploads'));



// Render the upload form (GET request)
app.get('/', (req, res) => {
  res.render('upload');  // Renders views/index.ejs
});

// Endpoint for file upload (POST request)
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // Handle errors such as file size or other multer issues
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.status(500).json({ error: 'Something went wrong during the file upload.' });
      }
    }

    // Success response: Render a page with upload results
    return res.render('upload-success', {
      message: 'Files uploaded successfully!',
      files: req.files,  // Pass the uploaded files information to the view
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(__dirname)
});
