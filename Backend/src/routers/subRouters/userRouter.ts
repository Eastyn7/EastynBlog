import { Router } from 'express'
import { authorizeRole } from '../../middlewares/authenticationMiddleware'
import { getUsersInfo, getUserInfo, updateUserInfo, deleteUser } from '../../controllers/userController'

const router = Router()

// 获取所有用户信息
router.post('/getusersinfo', authorizeRole('owner'), getUsersInfo)

// 获取单个用户信息
router.post('/getuserinfo', getUserInfo)

// 更新用户信息
router.put('/updateuserinfo', updateUserInfo)

// 删除用户
router.delete('/deleteuser', authorizeRole('owner'), deleteUser )

export default router
