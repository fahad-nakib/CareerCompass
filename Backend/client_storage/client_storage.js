const express=require("express")
const router=express.Router()
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});


router.get('/getinfo/:id', (req, res) => {
    const sql = 'SELECT storage_value FROM client_storage WHERE storage_key = ?';
    const storage_key = req.params.id;
    //console.log(storage_key); 
    db.query(sql,[storage_key], (err, result) => {
      if (err) throw err;
      //console.log(result); 
      return res.status(200).json(result);
    } );
  });


  router.post('/postinfo/:id', (req, res) => {
    const sql = 'UPDATE client_storage SET storage_value = ? WHERE storage_key = ?';
    const storage_key = req.params.id;
    const storage_value = req.body.storage_value; // Assuming the value is sent in the request body
    //console.log(storage_key); 
    db.query(sql,[storage_value,storage_key], (err, result) => {
      if (err) throw err;
      //console.log(result); 
      return res.status(200).json(result);
    } );
  });



module.exports=router