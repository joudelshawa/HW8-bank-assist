const dasha = require("@dasha.ai/sdk");
const fs = require("fs");
const { connect } = require("http2");
const newConn = require("./DBConnection");

async function main() {
  const app = await dasha.deploy("./app");

  app.ttsDispatcher = () => "Default";

  app.connectionProvider = async (conv) =>
    conv.input.phone === "chat"
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint("default"));
  await app.start();

  // function to check if client's id is valid
  app.setExternal("checkID", async(args, conv) => {

    let queryResponse = await queryGet();
    if(queryResponse)
      return true; 
    else return false;    
  
    async function queryGet() {
      let con = await newConn();
      await con.connect();
      var query = 'SELECT clientID FROM Client WHERE clientID = ' + args.clientID;
      console.log(query);

      const resultQ = await con.query(query);
      await con.end();
      return resultQ[0].length > 0;
    }    
  });

  // function to get today's transactions
  app.setExternal("getTodaysTransactions", async(args, conv) => {

    let con = await newConn();
    await con.connect();

    // query to get client's transactions 
    let query = 'SELECT location, amount FROM Transaction WHERE dateposted = CURDATE() AND clientID = ' + args.clientID;
    console.log(query);
    let text = "You spent";
    const resultQ = await con.query(query);
    const result = resultQ[0];
    console.log(result);
    for(let r of result){
      text += r.amount + " at " + r.location + " and ";
    }
    text += "that's it for today's transactions";
    
    await con.end();
    return text;
  });

  // function to get information about nearest bill
  app.setExternal("getNearestStatement", async(args, conv) => {

    let con = await newConn();
    await con.connect();

    // query to get client's nearest statement 
    let query = 'SELECT duedate, amount FROM Statement WHERE duedate > CURDATE() AND duedate < (ADDDATE(CURDATE(), INTERVAL 1 MONTH)) AND clientID = ' + args.clientID;
    let text = "";
    const resultQ = await con.query(query);
    const result = resultQ[0];

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    for(let r of result){
      text = "Your next statement is due on " + r.duedate.toLocaleDateString('en-US', options) + " and has a balance of " + r.amount + ".";
    }

    await con.end();
    return text;
  });

  const conv = app.createConversation({
    phone: process.argv[2],
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
  await app.stop();
  app.dispose();
  await logFile.close();
}

process.on("unhandledRejection", (reason, promise) => {
  // do something
});

main();
