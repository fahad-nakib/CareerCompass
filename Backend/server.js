const express = require('express');
const bodyParser = require('body-parser');
const studentRouter = require("./student/student");
const institutionRouter = require("./institution/institution");
const adminRouter = require("./admin/admin");
const admissionOfficerRouter = require("./admissionOfficer/admissionOfficer");
const professorRouter = require("./professor/professor");
const clientRouter = require("./client_storage/client_storage");
const commonRouter = require("./commoninfo/commoninfo");

const app = express();

// Parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});


app.get('/', (req, res) => {
  res.send('Server is alive!');
});

app.use('/student', studentRouter);
app.use('/institution', institutionRouter);
app.use('/admin', adminRouter);
app.use('/admissionOfficer',admissionOfficerRouter);
app.use('/professor', professorRouter);
app.use('/client_storage', clientRouter);
app.use('/commoninfo', commonRouter);


app.listen(8081, () => {
  console.log(`Server running on http://localhost:8081`);
  // console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app; // Export the app for testing purposes
module.exports = db; // Export the connection