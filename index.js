const dasha = require("@dasha.ai/sdk");
const fs = require("fs");
const { connect } = require("http2");
const newConn = require("./DBConnection");
// ^^figure out way to connect it somehow
// added by joud idk

// const mysql = require('mysql');
// let connection = mysql.createConnection({
//     host: '104.198.24.39',
//     user: 'root',
//     password: 'JIcmozn2pdbFHwIa',
//     database: 'bankDB'
// })
// connection.connect();






async function main() {
  const app = await dasha.deploy("./app");

  app.ttsDispatcher = () => "Default";

  app.connectionProvider = async (conv) =>
    conv.input.phone === "chat"
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint("default"));
  await app.start();

  // app.setExternal("check_availability", (args, conv) => {
  //   // Implement how to check availability in yoor database
  //   // Now availability is random
  //   return Math.random() > 0.5;
  // });





  
  // function to check if client's id is valid
  app.setExternal("checkID", async(args, conv) => {
    console.log("in js check ID method " + args.clientID);

    let con = newConn();
    con.connect();

    const query = util.promisify(conn.query).bind(conn);

  (async () => {
    try {
      const rows = await query('select count(*) as count from file_managed');
      console.log(rows);
    } finally {
      conn.end();
    }
  })()



  //   // if (args.clientID == 14) return true;
  //   // else return false;
  //   // const promiseA = new Promise(queryGet);
  //   let queryResponse = await queryGet();
  //   if(queryResponse){
  //     return true; }
  //     else return false;    
    
  //   // query to get client's id to see if it is in our database 
  //   var t = 0;
  //   var someVar = [];
  // //  // async function getRows() {
  // //   function quo (success){
  // //     value = con.query(
  // //        'SELECT clientID FROM Client WHERE clientID = ' + args.clientID , 
  // //        function (error, results, fields) {
  // //            if (error) throw error;
  // //            console.log('The id is: ', results[0].clientID);
  // //            success (results[0].clientID);
  // //        });
  // // }
  
  // // quo (function (role) {
  // //    console.log(role);
  // //    /* do something useful with the role that came back from the query */
  // //    if (role.length > 0) t=1;
  // //   //  else return false;
  // // });
  
  //   async function queryGet() {
  //     let con = newConn();
  //     con.connect();
  //     var query = 'SELECT clientID FROM Client WHERE clientID = ' + args.clientID;
  //     console.log(query);

  //     // con.query(query, (err,rows) => {
  //     con.query(query => {
  //       if(err) throw err;
  //       else{
  //         let stuff = setValue(rows);
  //         return stuff;
  //       }
  //     }); 
  //     con.end();
  //   }

  //       // for(let r of rows){
  //       //   content = "true";
  //       //   console.log("yuh");
  //       //   console.log(r.clientID);
  //       //   return content;
  //       // }
  //       // if(t==0){
  //       //   console.log("nuh");
  //       //   return false;
  //       // }
  //       // if (rows > 0) {
  //       //   console.log('Data received from Db:');
  //       //   console.log(rows);
  //       //   // let id = args.clientID;
  //       //   t = 1;
  //       // }
  //       // otherwise user's id does not exist
      
  //   //}
  //   function setValue(value){
  //     someVar = value;
  //     console.log(someVar);
  //     if (someVar.length > 0) return true;
  //     else return false;
  //   }
    
    // console.log("checked id!");
    
    //return await getRows();
    console.log(t);
    
  });

  // function to get today's transactions
  app.setExternal("getTodaysTransactions", async(args, conv) => {
    // console.log("in js transaction method");
    // return ("you bought bubble tea today for $7.98");
    let con = newConn();
    con.connect();
    // query to get client's transactions 
    var query = 'SELECT location, amount FROM Transaction WHERE dateposted = CURDATE() AND clientID = ' + args.clientID;
    var text = "";
    con.query(query, (err,rows) => {
      if(err) throw err;
    
      console.log('Data received from Db:');
      console.log(rows);
      let content ='';
      for(let r of rows){
        content += r.amount + " at " + r.location + " and ";
        console.log(r.amount);
        // console.log(r.location);
      }
      content += "that's it for today's transactions";
      text = content;
      return content; 
    });
    con.end();
    console.log("in js transaction method 2 " + text);
    return text;
  });

  // function to get information about nearest bill
  app.setExternal("getNearestStatement", async(args, conv) => {
    console.log("in js statement due date method");
    // return ("your nearest bill due date is november 29, 2021, and the amount is $1347.93");
    let con = newConn();
    con.connect();
    // query to get client's nearest statement 
    var query = 'SELECT duedate, amount FROM Statement WHERE duedate > CURDATE() AND duedate < (ADDDATE(CURDATE(), INTERVAL 1 MONTH) AND clientID = ' + args.clientID;
    var text = "";
    con.query(query, (err,rows) => {
      if(err) throw err;
    
      console.log('Data received from Db:');
      console.log(rows);
      let content ='';
      for(let r of rows){
        content = "Your next statement is due on " + r.duedate + " and has a balance of " + r.amount + ".";
        console.log(r.amount);
      }
      text = content;
      console.log("in js statement due date method");
      // return data idk
    });
    con.end();
    return text;
  });

  // const days = [
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  //   "Sunday",
  // ];
  // Select random day of appointment
  // You should define it with the database
  // let day = days[Math.floor(Math.random() * days.length)];

  const conv = app.createConversation({
    phone: process.argv[2],
    // day_of_week: day,
  });

  if (conv.input.phone !== "chat") conv.on("transcription", console.log);

  const logFile = await fs.promises.open("./log.txt", "w");
  await logFile.appendFile("#".repeat(100) + "\n");

  conv.on("transcription", async (entry) => {
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on("debugLog", async (event) => {
    if (event?.msg?.msgId === "RecognizedSpeechMessage") {
      const logEntry = event?.msg?.results[0]?.facts;
      await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n");
    }
  });

  const result = await conv.execute();
  // Scedule new call on day_recall
  console.log(result.output.day_recall);
  // Rescedule appointment on new_day in yoor database
  console.log(result.output.new_day);
  await app.stop();
  app.dispose();
  await logFile.close();
}

process.on("unhandledRejection", (reason, promise) => {
  // do something
});

main();
