const express=require("express")
const router=express.Router()
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});

router.get('/professorinfo', (req, res) => {
    const sql = 'SELECT * FROM professors';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    } );
} );  

router.get('/professorinfo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM professors WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      //console.log(result);
      return res.status(200).json(result);
    } );
});  

router.post('/professorinfo', (req, res) => {
    const { professorId, name, email, universityId,department, description, profilePicture, officeTime, freeTime, } = req.body;
    const sql = 'INSERT INTO professors (`id`, `name`, `email`, `institution_id`, `department`, `bio`, `image_url`, `office_hours`, `contact_info`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [ professorId, name, email, universityId,department, description, profilePicture, officeTime, freeTime,], (err, result) => {
      if (err) throw err;
      return res.status(201).json({ message: 'Professor registered successfully!' });
    } );
} );  

router.put('/professorinfo/update/:id', (req, res) => { 
    const id = req.params.id;
    const { name, email, universityId,department, description, profilePicture, officeTime, freeTime } = req.body;
    const sql = 'UPDATE professors SET name = ?, email = ?, institution_id = ?, department = ?, bio = ?, image_url = ?, office_hours = ?, contact_info = ? WHERE id = ?';
    db.query(sql, [name, email, universityId,department, description, profilePicture, officeTime, freeTime,id], (err, result) => {
      if (err) throw err;
      return res.status(200).json({ message: 'Professor updated successfully!' });
    } );
});    

router
.delete('/professorinfo/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM professors WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      return res.status(200).json({ message: 'Professor deleted successfully!' });
    } );
} );  


router.get('/institutionname/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT name FROM institutionregister WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      //console.log(result);
      return res.status(200).json(result);
    } );
});

router.get('/pendingapplications', (req, res) => {
    const sql = 'SELECT * FROM applications WHERE status = "pending"';
    db.query(sql, (err, result) => {
      if (err) throw err;
      //console.log("pending applications",result);
      return res.status(200).json(result);
    } );
} );









module.exports=router