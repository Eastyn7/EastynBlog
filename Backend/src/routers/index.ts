import { Router } from 'express'
import publicRoutes from './subRouters/publicRouter'
import userRoutes from './subRouters/userRouter'

const router = Router()

router.use('/public', publicRoutes) // 开放API
router.use('/user', userRoutes) // 用户相关的API

export default router