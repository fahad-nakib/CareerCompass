const express=require("express")
const router=express.Router()
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});

router.get('/programcount', (req, res) => {
    const sql = 'SELECT COUNT(*) as program_count FROM programs';
    db.query(sql, (err, result) => {
      if (err) throw err;
      //console.log(result);
      return res.status(200).json(result);
    } );
});
router.get('/institutioncount', (req, res) => {
    const sql = 'SELECT COUNT(*) as institution_count FROM institutionregister';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    } );
});
router.get('/studentcount', (req, res) => {
    const sql = 'SELECT COUNT(*) as student_count FROM studentregister';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    } );
});
router.get('/countrycount', (req, res) => {
    
    const sql = `SELECT COUNT(DISTINCT location) as unique_location_count FROM institutionregister
    WHERE location IS NOT NULL AND location != ''`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log("country count: ",result);
      return res.status(200).json(result);
    } );
});



module.exports=router