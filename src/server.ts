import server from "./app";

const global = server.listen(process.env.PORT,()=>{
    console.log("App is runnig at http://localhost:%d in %s mode", process.env.PORT, process.env.NODE_ENV);
    console.log(" Press CTRL-C to stop\n");
},);

export default global;