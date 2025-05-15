const express=require("express")
const router=express.Router()

const {institutionRegister} = require("../sql/sql")
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});

router.get('/institutionregister', (req, res) => {
    const sql = 'SELECT * FROM institutionregister';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    } );
} );


router.put('/institutionregister/update/:role', (req, res) => {
  const role = req.params.role;
  const email = req.body;
  //console.log(req.body); // Debug log
  //console.log(id); // Debug log
  //console.log(role); // Debug log to check the request body
  //console.log(email); // Debug log to check the request body

  const sql = `UPDATE institutionregister SET role = ? WHERE email = ?`;

  db.query(sql,[role, email],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update institution!' });
      }
      res.json({ message: 'Institution updated successfully!' });
      console.log('Institution updated successfully!');
    }
  );
});

router.put('/institutionregister/updatePending', (req, res) => {
  const id = req.body.id;
  const { isRegistered, isApproved, isRejected, approvedDate,rejectedDate } = req.body;
  //console.log(req.body); // Debug log
  //console.log(id); // Debug log

  const sql = `UPDATE institutionregister SET isRegistered = ?, isApproved = ?, isRejected = ?, approvedDate = ? WHERE id = ?`;

  db.query(sql,[isRegistered, isApproved, isRejected, approvedDate, id],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update institution!' });
      }
      res.json({ message: 'Institution updated successfully!' });
      console.log('Institution updated successfully!');
    }
  );
});

router.post('/institutionregister', institutionRegister)



//---------------Application------------------//
router.get('/application', (req, res) => {
  const sql = 'SELECT * FROM applications';
  db.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json(result);
  } );
} );
router.get('/application/:id', (req, res) => {
  const sql = 'SELECT * FROM applications WHERE id = ?';
  const applicationId = req.params.id; // Get the program_id from the query parameters
  //console.log(applicationId); // Debug log to check the program_id
  db.query(sql,[applicationId], (err, result) => {
    if (err) throw err;
    //console.log(result); // Debug log to check the result
    return res.status(200).json(result);
  } );
});

//---------------Program Handling------------------//
router.get('/programs', (req, res) => {
  const sql = 'SELECT * FROM programs';
  db.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json(result);
  } );
});

router.get('/programs/requirments/:id', (req, res) => {
  const sql = 'SELECT requirement FROM program_requirements WHERE program_id = ?';
  const programId = req.params.id; // Get the program_id from the query parameters
  //console.log(programId); // Debug log to check the program_id
  db.query(sql,[programId], (err, result) => {
    if (err) throw err;
    //console.log(result); // Debug log to check the result
    return res.status(200).json(result);
  } );
});

router.post('/programs', (req, res) => {
  const { id, title, description, university, degree, discipline, duration, tuitionFee, applicationFee, deadline, startDate, department, scholarshipsAvailable, institutionId, level, ranking, imageUrl, location, createdAt, updatedAt } = req.body;
  //console.log({ id, title, description, university, degree, discipline, duration, tuitionFee, applicationFee, deadline, startDate, department, scholarshipsAvailable, institutionId, level, ranking, imageUrl, location, createdAt, updatedAt }); // Debug log

  const sql = "INSERT INTO `programs`(`id`, `title`, `description`, `university`, `degree`, `discipline`, `duration`, `tuitionFee`, `applicationFee`, `deadline`, `startDate`, `department`, `scholarshipsAvailable`, `institutionId`, `level`, `ranking`, `imageUrl`, `location`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?)";

  db.query(sql,[ id, title, description, university, degree, discipline, duration, tuitionFee, applicationFee, deadline, startDate, department, scholarshipsAvailable, institutionId, level, ranking, imageUrl, location, createdAt, updatedAt ], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Registration failed!' });
    }
    res.json({ message: 'Program added successfully!' });
  });
});

router.post('/programs/requirements/:pId', (req, res) => {
  const programId = req.params.pId; // Get the program_id from the query parameters

  const requirement= req.body;
  //console.log("programid & requirment: ",programId, requirement ); // Debug log

  for (let i = 0; i < requirement.length; i++) {
    //const sql = "INSERT INTO `program_requirements`(`program_id`, `requirement`) VALUES (?, ?)";
    const sql2 = 'INSERT INTO program_requirements (program_id, requirement) VALUES (?, ?)';
    db.query(sql2,[programId, requirement[i] ], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Registration failed!' });
      }
      res.json({ message: 'Program requirements added successfully!' });
  });
  }

} );


module.exports=router 