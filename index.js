/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// import dependencies
const bodyParser = require('body-parser'),
      express = require('express'),
      app = express().use(bodyParser.json());

// webhook setup
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// webhook verification
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  // From application of facebook developer
  let VERIFY_TOKEN = "EAADhPGPjrSYBAChaHvZC15mYRJP2v2jWSXFuhX6kJPGTwMxgU1MobSkDqrBIVS5N8oeZCkckaXmZBukGVKmD7y4A75ZBvNdheBmKBI2FVI0Pwj20E7cnlSXzOjaDIVabLd0T3p5TtMOwsUtRAOZCZAx7yAj9YVAlzUExFaUKAd5QZDZD"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }

});

// webhook
app.post('/webhook', (req, res) => {

  // Facebook quick start code
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
  // Facebook quick start code


  /* Default code below
  // parse messaging array
  const webhook_events = req.body.entry[0];

  // initialize quick reply properties
  let text, title, payload;

  // Secondary Receiver is in control - listen on standby channel
  if (webhook_events.standby) {
    
    // iterate webhook events from standby channel
    webhook_events.standby.forEach(event => {
    
      const psid = event.sender.id;
      const message = event.message;

      if (message && message.quick_reply && message.quick_reply.payload == 'take_from_inbox') {
        // quick reply to take from Page inbox was clicked          
        text = 'The Primary Receiver is taking control back. \n\n Tap "Pass to Inbox" to pass thread control to the Page Inbox.';
        title = 'Pass to Inbox';
        payload = 'pass_to_inbox';
        
        sendQuickReply(psid, text, title, payload);
        HandoverProtocol.takeThreadControl(psid);
      }

    });   
  }

  // Bot is in control - listen for messages 
  if (webhook_events.messaging) {
    
    // iterate webhook events
    webhook_events.messaging.forEach(event => {      
      // parse sender PSID and message
      const psid = event.sender.id;
      const message = event.message;

      if (message && message.quick_reply && message.quick_reply.payload == 'pass_to_inbox') {
        
        // quick reply to pass to Page inbox was clicked
        let page_inbox_app_id = 263902037430900;          
        text = 'The Primary Receiver is passing control to the Page Inbox. \n\n Tap "Take From Inbox" to have the Primary Receiver take control back.';
        title = 'Take From Inbox';
        payload = 'take_from_inbox';
        
        sendQuickReply(psid, text, title, payload);
        HandoverProtocol.passThreadControl(psid, page_inbox_app_id);
        
      } else if (event.pass_thread_control) {
        
        // thread control was passed back to bot manually in Page inbox
        text = 'You passed control back to the Primary Receiver by marking "Done" in the Page Inbox. \n\n Tap "Pass to Inbox" to pass control to the Page Inbox.';
        title = 'Pass to Inbox';
        payload = 'pass_to_inbox';
        
        sendQuickReply(psid, text, title, payload);

      } else if (message && !message.is_echo) {      
        
        // default
        text = 'Welcome! The bot is currently in control. \n\n Tap "Pass to Inbox" to pass control to the Page Inbox.';
        title = 'Pass to Inbox';
        payload = 'pass_to_inbox';

        sendQuickReply(psid, text, title, payload);
      }
      
    });
  }

  // respond to all webhook events with 200 OK
  res.sendStatus(200);
  */
});
