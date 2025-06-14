import express from 'express';  
import { UserRoutes } from '../modules/user/user.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';

const router = express.Router();    


const moduleRoutes = [
    {
        path:"/user",
        route: UserRoutes   
    },
    {
        path:"/admin",
        route: AdminRoutes          
    },
    {
        path:"/auth",
        route: AuthRoutes          
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export const indexRoute =  router;
