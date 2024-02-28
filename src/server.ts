import server from "./app";

const global = server.listen(3000,()=>{
    console.log("App is runnig at http://localhost:%d in %s mode", 3000, "production");
    console.log(" Press CTRL-C to stop\n");
},);

export default global;