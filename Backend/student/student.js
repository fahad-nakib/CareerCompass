const express=require("express")
const router=express.Router()
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});



router.post('/studentregister', (req, res) => {
    if (!req.body?.name || !req.body?.email || !req.body?.password) {
      return res.status(400).json({ error: 'Name, email, and password are required!' });
    }
  
    const { name, email, password } = req.body;
    //console.log({ name, email, password }); // Debug log
  
    const sql = 'INSERT INTO studentregister (name, password, date, email) VALUES (?, ?, current_timestamp(), ?)';
    
    db.query(sql, [name, password, email], (err, result) => { // Fix: Correct order [name, password, email]
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Registration failed!' });
      }
      res.json({ message: 'Student registered successfully!' });
    });
});
  
  
router.get('/studentregister', (req, res) => {
    const sql = 'SELECT * FROM studentregister';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.json(result);
    } );
});



router.get('/students/:id', (req, res) => {
  const user_id = req.params.id;
  //console.log('user_id:', user_id, 'Type:', typeof user_id);
  
  // First verify the user_id exists in the database
  const sql = 'SELECT * FROM students WHERE user_id = ?';
  
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database operation failed' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    return res.status(200).json(result);
  });
});

// Get student by uniqueID
router.get('/studentuid/:id', (req, res) => {
  const user_id = req.params.id;
  //console.log('user_id:', user_id, 'Type:', typeof user_id);
  
  // First verify the user_id exists in the database
  const sql = 'SELECT * FROM students WHERE id = ?';
  
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database operation failed' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    return res.status(200).json(result);
  });
});

//------------------Education Handling------------------//

router.post('/education', (req, res) => {
  if (!req.body?.studentId || !req.body?.institution || !req.body?.field_of_study) {
    return res.status(400).json({ error: 'studentId, institution, and field_of_study are required!' });
  }

  const { studentId, institution, degree,field_of_study,start_date,end_date,gpa } = req.body;
  //console.log({ name, email, password }); // Debug log

  const sql = 'INSERT INTO student_education (student_id, institution, degree,field_of_study,start_date,end_date,gpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [studentId, institution, degree,field_of_study,start_date,end_date,gpa], (err, result) => { // Fix: Correct order [name, password, email]
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Registration failed!' });
    }
    res.json({ message: 'Student registered successfully!' });
  });
});


router.get('/education/:id', (req, res) => {
  const sql = 'SELECT * FROM student_education WHERE student_id = ?';
  const student_id = req.params.id; // Get the program_id from the query parameters
  //console.log(student_id); // Debug log to check the program_id
  db.query(sql,[student_id], (err, result) => {
    if (err) throw err;
    //console.log(result); // Debug log to check the result
    return res.status(200).json(result);
  } );
});

//------------------Program Handling-----------------------//
router.post('/savedprogram/', (req, res) => {
  if (!req.body?.studentId || !req.body?.programId) {
    return res.status(400).json({ error: 'studentId and programId are required!' });
  }

  const { studentId, programId } = req.body;
  //console.log({ name, email, password }); // Debug log

  const sql = 'INSERT INTO savedprogram (program_id, student_id) VALUES (?, ?)';
  
  db.query(sql, [programId, studentId], (err, result) => { // Fix: Correct order [name, password, email]
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Registration failed!' });
    }
    res.json({ message: 'Program saved successfully!' });
  });
} );

router.get('/savedprogram/:id', (req, res) => { 
  const sql = 'SELECT * FROM savedprogram WHERE student_id = ?';
  const student_id = req.params.id; // Get the program_id from the query parameters
  //console.log(student_id); // Debug log to check the program_id
  db.query(sql,[student_id], (err, result) => {
    if (err) throw err;
    //console.log(result); // Debug log to check the result
    return res.status(200).json(result);
  } );
} );

//------------------Appplication Handling------------------//


router.get('/getapplicatioins', (req, res) => {
  const sql = 'SELECT * FROM applications';
  db.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json(result);
  } );
} );

router.get('/getApplicatioinsProgramNameByPid/:id', (req, res) => {
  const sql = 'SELECT title FROM programs WHERE id = ?';
  const id = req.params.id; // Get the program_id from the query parameters
  //console.log(id); // Debug log to check the program_id
  db.query(sql,[id], (err, result) => {
    if (err) throw err;
    //console.log(result); // Debug log to check the result
    res.status(200).json(result);
  } );
} );


router.post('/submitapplication', (req, res) => {
  const { id, programId, studentId, studentName, status} = req.body;
  //console.log({ id, programId, studentId, studentName, status }); // Debug log
  //console.log({ name, email, password }); // Debug log

  const sql = `INSERT INTO applications (id, program_id, student_id, student_name, status, application_date, feedback, sop, payment_status, payment_amount, payment_date, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, current_timestamp(), NULL, NULL, NULL, NULL, NULL, current_timestamp(), current_timestamp())`;
  
  db.query(sql, [id, programId, studentId, studentName, status], (err, result) => { // Fix: Correct order [name, password, email]
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Registration failed!' });
    }
    res.json({ message: 'Submit application successfully!' });
  });
});

router.put('/updateapplication/status', (req, res) => {
  const { id, programId, studentId, studentName, status} = req.body;
  //console.log({ id,status }); // Debug log
  //console.log({ name, email, password }); // Debug log

  const sql = `UPDATE applications SET status = ?, updated_at = current_timestamp() WHERE id = ?`;
  db.query(sql, [status, id], (err, result) => { // Fix: Correct order [name, password, email]
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Registration failed!' });
    }
    res.json({ message: 'Update application successfully!' });
  } );
});

router.post('/addcomment', (req, res) => {
  const { id, application_id, author_id, comment} = req.body;
  //console.log({ id, programId, studentId, studentName, status }); // Debug log
  console.log({id, application_id, author_id, comment }); // Debug log
  const sql = `INSERT INTO application_comments (id, application_id, author_id, comment)
  VALUES (?, ?, ?, ?)`;
  
  db.query(sql, [id, application_id, author_id, comment], (err, result) => { // Fix: Correct order [name, password, email]
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({error: 'Registration failed!' });
    }
    res.json({ message: 'Submit application successfully!' });
  });
});

router.get('/getcomment/:id',(req,res)=>{
  const application_id = req.params.id;
  console.log("applicatin id : ", application_id);
  
  const sql = `
    SELECT * FROM application_comments WHERE application_id = ?`;
  
  db.query(sql, [application_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
    res.json(results);
  });
});


  module.exports=router