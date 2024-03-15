const db = require('../Database/connection');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const getGoogleIdCheck = (google_id) => {
    return new Promise((resolve, reject) => {
        const checkUserSql = 'SELECT * FROM user_register WHERE google_id = ?';

        db.query(checkUserSql, [google_id], (error, result) => {
            if (error) {
                console.error('Error checking user existence:', error);
                reject(error);
            } else {
                resolve(result.length > 0);
                console.log(result.length);
            }
        });
    });
};

function registeruser(creatorData) {
    return new Promise((resolve, reject) => {
        const insertSql = `INSERT INTO user_register( name, image, google_id) 
                           VALUES (?, ?, ?)`;

        const values = [
            creatorData.name,
            creatorData.image,
            creatorData.google_id
        ];

        db.query(insertSql, values, (error, result) => {
            if (error) {
                console.error('Error adding user:', error);
                reject(error);
            } else {
                const adminId = result.insertId;

                if (adminId > 0) {
                    resolve(creatorData.name);
                } else {
                    const errorMessage = 'User registration failed';
                    reject(errorMessage);
                }
            }
        });
    });
}

const login = (google_id, callback) => {
    const query = 'SELECT * FROM user_register WHERE google_id = ?';
    db.query(query, [google_id], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback({ error: 'User not found' }, null);
        }

        const user = results[0];

        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            secretKey
        );

        return callback(null, {
            data: {
                id: user.id,
                name: user.name,
                google_id: user.google_id,
                role: user.role,
                token: token,
            },
        });
    });
};

const registerlogin = (name, callback) => {
    const query = 'SELECT * FROM user_register WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback({ error: 'User not found' }, null);
        }

        const user = results[0];

        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            secretKey
        );

        return callback(null, {
            data: {
                id: user.id,
                name: user.name,
                google_id: user.google_id,
                role: user.role,
                token: token,
            },
        });
    });
};




async function username(name) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user_register WHERE name = ?";
      db.query(query, [name], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }


module.exports = {
    getGoogleIdCheck,
    login,
    registeruser,
    registerlogin,
    username
};
