import mysql from 'mysql';
import dotenv from 'dotenv';

// 加载 .env 配置
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 封装 db.query 为 Promise
export const query = <T>(sql: string, values?: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

export default db;
