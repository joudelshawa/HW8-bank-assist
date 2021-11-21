import "commonReactions/all.dsl";

context 
{
    // declare input variables phone and name  - these variables are passed at the outset of the conversation. In this case, the phone number and customer’s name 
    input phone: string;

    // declare storage variables 
    output first_name: string = "";
    output last_name: string = "";
    output clientID: string = "";

}

// declaring external functions
external function getTodaysTransactions(clientID: string): string;
external function checkID(clientID: string): boolean;
external function getNearestStatement(clientID: string): string;

start node root 
{
    do 
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        #sayText("Hi, welcome to Bank Yeller. I'm Dasha, your artificially intelligent assistant. May I have your name please?");
        wait *;
    }   
    transitions 
    {
    }
}

digression how_may_i_help
{
    conditions {on #messageHasData("first_name");} 
    do 
    {
        set $first_name =  #messageGetData("first_name")[0]?.value??"";
        set $last_name =  #messageGetData("last_name")[0]?.value??"";
        #sayText("Pleased to meet you " + $first_name + ", how may I assist you today?");
        wait *;
    }
}

digression check_transactions {
    conditions {on #messageHasIntent("transactions_today");}
    do {
        if ($clientID == "") { // check if have client ID
            #sayText("Can I please get your client ID number first?"); // if not, ask for it
        }
        wait*;
    }
    transitions { // wait for transition
        transactions: goto transactions on $clientID != "" tags:ontick ; // ontick is every 200ms -> this will be checked - if client ID is not an empty string go to node
    }
}

node transactions {
    do {
        var response = external getTodaysTransactions($clientID);
        #sayText(response);
        #sayText("Is there anything else I can help you with today?");
        wait*;
    }
}

digression confirmID {
    conditions { on #messageHasData("id"); }
    do {
        var cid = #messageGetData("id", { value: true })[0]?.value??"";
        var response = external checkID(cid);
        if (response) {
            #sayText("Perfect!");            
            set $clientID = cid;
            return;
        }
        else {
            #sayText("Sorry, we do not seem to have a client with that ID in our bank. Try again.");
            return;
        }
    }
    transitions {
    }
}

digression check_statement {
    conditions {on #messageHasIntent("bill_due");}
    do {
        if ($clientID == "") { // check if have client ID
            #sayText("Can I please get your client ID number first?"); // if not, ask for it
        }
        wait*;
    }
    transitions { // wait for transition
        statements: goto statements on $clientID != "" tags:ontick ; // ontick is every 200ms -> this will be checked - if client ID is not an empty string go to node
    }
}

node statements {
    do {
        var response = external getNearestStatement($clientID);
        #sayText(response);
        #sayText("Would you like to pay it off?");
        wait*;
    }
    transitions {
        // confirmID: goto confirmID on #messageHasData("id");
        bill_paid_off: goto bill_paid_off on #messageHasIntent("yes");
    }
}

node bill_paid_off {
    do {
        #sayText("Your upcoming bill has been paid off.");
        #sayText("Is there anything else I can help you with today?");
        wait*;
    }
}

digression list_options {
    conditions {on #messageHasIntent("give_options");}
    do {
        #sayText("You can ask me about today's transactions, or to check your statement balance, due date, and pay it off if you want.");
        wait*;
    }
    transitions {

    }
}

digression can_help_else
{
    conditions {on #messageHasIntent("got_you");} 
    do 
    {     
        #sayText("Is there anything else I can help you with today?"); 
        wait*;
    }
}


digression thats_it_bye
{
    conditions {on #messageHasIntent("thank_you") or #messageHasIntent("that_would_be_it");} 
    do 
    {     
        #sayText("No problem, happy to help. I hope you have a great rest of your day. Bye!"); 
        #disconnect();
        exit;
    }
}


//final and additional 

digression can_help 
{
    conditions {on #messageHasIntent("need_help");} 
    do
    {
        #sayText("How can I help you?");
        wait*;
    }
}


// additional digressions 

digression how_are_you
{
    conditions {on #messageHasIntent("how_are_you");}
    do 
    {
        #sayText("I'm well, thank you!", repeatMode: "ignore");
        #repeat(); // let the app know to repeat the phrase in the node from which the digression was called, when go back to the node 
        return; // go back to the node from which we got distracted into the digression 
    }
}

digression bye 
{
    conditions { on #messageHasIntent("bye"); }
    do 
    {
        #sayText("Sorry we didn't see this through. Call back another time. Bye!");
        #disconnect();
        exit;
    }
}
