const db = require('../Database/connection');
const dotenv = require('dotenv');

dotenv.config();




function subcategoryAdd(price,duration,name,minutes) {
    return new Promise((resolve, reject) => {
      const insertSql = `
          INSERT INTO subscription_plan(price,duration,name,minutes) 
          VALUES (?,?,?,?)`;
  
      const values = [price,duration,name,minutes];
  
      db.query(insertSql, values, (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          reject(error);
        } else {
          const adminId = result.insertId;
  
          if (adminId > 0) {
            const successMessage = "add subscription  successful";
            resolve(successMessage);
          } else {
            const errorMessage = "add subscription  failed";
            reject(errorMessage);
          }
        }
      });
    });
  }
  
module.exports = {
    subcategoryAdd
};
