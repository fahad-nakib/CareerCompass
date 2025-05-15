//const express=require("express")
//const router=express.Router()
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'careercompass'
});





const institutionRegister = (req, res) => {
    // Required fields check
    if (!req.body?.name || !req.body?.email || !req.body?.password) {
      return res.status(400).json({ error: 'Name, email, and password are required!' });
    }
  
    // Extract all possible fields from request body
    const name = req.body?.name ?? null;
    const email = req.body?.email ?? null;
    const password = req.body?.password ?? null;
    const role = req.body?.role ?? '';
    const website = req.body?.website ?? null;
    const location = req.body?.location ?? null;
    const description = req.body?.description ?? null;
    const document = req.body?.document ?? null;
    const rejectionReason = req.body?.rejectionReason ?? null;
    const isRegistered = req.body?.isRegistered ?? 0;
    const isApproved = req.body?.isApproved ?? 0;
    const isRejected = req.body?.isRejected ?? 0;
    const registrationDate = req.body?.registrationDate ?? null;
    const approvedDate = req.body?.approvedDate ?? null;
    const rejectedDate = req.body?.rejectedDate ?? null;
    const date = req.body?.date ?? null;
    console.log(role); // Debug log to check the request body
  
  
    const sql = `  INSERT INTO institutionregister (
      name, email, website, location, description, password, date, 
      isRegistered, isApproved, isRejected, registrationDate, approvedDate, 
      rejectedDate, rejectionReason, role, document) 
      VALUES (?, ?, ?, ?, ?, ?, current_timestamp(), 0, 0, 0, ?, ?, ?, ?, ?, ? )`;
    
    db.query(sql, [name, email, website, location,description, password,date,
      isRegistered, isApproved, isRejected,registrationDate, approvedDate, rejectedDate,
      rejectionReason, req.body.role, document], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Institution registration failed!' });
        }
        console.log('Institution registered successfully!');
      res.json({ message: 'Institution registered successfully!' });
    });
  };

module.exports={institutionRegister} 