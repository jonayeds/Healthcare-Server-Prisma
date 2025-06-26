import express from 'express';  
import { UserRoutes } from '../modules/user/user.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { SpecialityRoutes } from '../modules/speciality/speciality.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';
import { PatientRoutes } from '../modules/patient/patient.routes';
import { ScheduleRoutes } from '../modules/shedule/schedule.routes';
import { DoctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';
import { AppointmentRoutes } from '../modules/appointment/appointment.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { PrescriptionRoutes } from '../modules/prescription/prescription.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { MetaRoutes } from '../modules/meta/meta.routes';

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
    },
    {
        path:"/speciality",
        route: SpecialityRoutes        
    },
    {
        path:"/doctor",
        route: DoctorRoutes        
    },
    {
        path:"/patient",
        route: PatientRoutes        
    },
    {
        path:"/schedule",
        route: ScheduleRoutes        
    },
    {
        path:"/doctor-schedule",
        route: DoctorScheduleRoutes        
    },
    {
        path:"/appointment",
        route: AppointmentRoutes        
    },
    {
        path:"/payment",
        route: PaymentRoutes        
    },
    {
        path:"/prescription",
        route: PrescriptionRoutes        
    },
    {
        path:"/review",
        route: ReviewRoutes        
    },
    {
        path:"/meta",
        route: MetaRoutes        
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export const indexRoute =  router;
