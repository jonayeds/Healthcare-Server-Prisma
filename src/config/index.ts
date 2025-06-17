import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  end: process.env.NODE_ENV,
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  jwt:{
    jwt_secret: process.env.JWT_SECRET,     
    expires_in: process.env.EXPIRES_IN, 
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,  
    reset_password_secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
    reset_password_expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,   
  } ,
  email_sender:{
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD, 
  }
};
