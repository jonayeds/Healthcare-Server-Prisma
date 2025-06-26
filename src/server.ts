import { Server } from "http";
import { app } from "./app";
import config from "./config";

const PORT = config.port || 8000;



async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on("uncaughtException", (error) => {
    if(server){
      server.close(()=>{
        console.info("Uncaught Exception: Shutting down server due to uncaught exception");
      })
    }
    console.log("Uncaught Exception:", error);
    process.exit(1);
  })

  process.on("unhandledRejection",(error)=>{
    if(server){
      server.close(()=>{
        console.info("Unhandled Rejection: Shutting down server due to unhandled rejection");
      })
    }
    console.error("Unhandled Rejection:", error);
    process.exit(1);
  })

}

main()
