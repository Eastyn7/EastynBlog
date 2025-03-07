import express from 'express';
import router from './routers/index';

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/api', router);

// 启动服务器
app.listen(3307, () => {
  console.log('API server running at http://127.0.0.1:3307');
});
