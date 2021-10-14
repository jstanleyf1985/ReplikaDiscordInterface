const os = require('os');
const fs = require('fs-extra');
const Utilities = require('./utilities');

const DiscordBotRun = (page, discordClient, request) => {
  // Define file paths
  const configFilePath = String(`${os.homedir()}/Documents/Replika Discord Interface/Configuration/Config.json`);
  const errorFilePath = String(`${os.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`);
  const testFilePath = String(`${os.homedir()}/Documents/Replika Discord Interface/Configuration/test.txt`);

  try {
    fs.readJson(configFilePath)
      .then((data) => {
        // Listen for messages
        discordClient.on('message', message => {
          let ReplikaMentionID;
          let ReplikaMentionIDFiltered;
          let ReplikaAlternateNames = []; // First in the array should be the bot's once pushed
          let ReplikaAlternateIDs = []; // First is in the array will be the bot's ID once pushed
          let DiscordMessageChannel;

          // Set ReplikaMentionID
          try {
            message.guild.roles.cache.each(memberRole => {
              if(memberRole.name == data.DiscordBotName) { ReplikaMentionID = memberRole.id}});
                message.guild.members.cache.each(member => ReplikaAlternateNames.push(`@${member.user.username}#${member.user.discriminator}`));
                message.guild.members.cache.each(member => ReplikaAlternateIDs.push(`${member.user.id}`));
              
              // Remove unnecessary characters on @ mentions
              ReplikaMentionIDFiltered = ReplikaMentionID.replace('<@','');
              ReplikaMentionIDFiltered = ReplikaMentionIDFiltered.replace('>','');
              ReplikaMentionIDFiltered = ReplikaMentionIDFiltered.replace('&','');
          } catch (err) {
            // If discord bot name is not recognized , it will be caught here
            // a separate error checking process will pick it up in the error log and throw an error to the user
            // then close reset the UI
            Utilities.createGeneralErrorMSG(err);
          }
          
          // If channel = ALL, do not do a channel check, else require channel when listening
          if(
              data &&
              data.DiscordChannel &&
              (data.DiscordChannel == 'ALL' || data.DiscordChannel == 'All' || data.DiscordChannel == 'all') &&
              data.RRequireAt == 'Disabled' ||
              (message.content.indexOf(ReplikaMentionIDFiltered) !== -1 ||
               message.content.indexOf(ReplikaAlternateNames[0]) !== -1 ||
               message.content.indexOf(ReplikaAlternateIDs[0]) !== -1
              )
            ) {
              // Get submitted content's channel
              message.fetch({limit: 1}).then(messages => {
                DiscordMessageChannel = messages.channel.id;

                if(messages.author != ReplikaAlternateIDs[0]) {
                  // Send message to replika via Playwright
                  let contentMSG = data.RRequireAt == 'Disabled' ? message.content : message.content.replace(message.content.slice(0, message.content.indexOf(' ') + 1), '');

                  // Check if message content contains only "upvote" or "downvote", if so, click the appropriate button on the last message
                  let upvoteMatchList = ['!Upvote','!upvote', '!Up Vote', '!up vote', '!up'];
                  let downvoteMatchList = ['!Downvote', '!downvote', '!Down Vote', '!down vote', '!down'];
                  let loveMatchList = ['!Love', '!love'];
                  let funnyMatchList = ['!Funny', '!funny'];
                  let meaninglessMatchList = ['!Meaningless', '!meaningless'];
                  let offensiveMatchList = ['!Offensive', '!offensive'];
                  let clearMatchList = ['!Clear', '!clear', '!Undo', '!undo'];

                  if(upvoteMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-upvote-button"]', 'None');
                  } else if(downvoteMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-downvote-button"]', 'None');
                  } else if (loveMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Love');
                  } else if (funnyMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Funny');
                  } else if (meaninglessMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Meaningless');
                  } else if (offensiveMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Offensive');
                  } else if (clearMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.resetClickElement(page);
                  } else {
                    page.click('#send-message-textarea');
                    // Prevent weird data from being entered
                    if(contentMSG.indexOf('<@') === -1) {
                      page.keyboard.type(`${contentMSG}\r`, { delay: 5 }); // Send message
                      
                      // Channel URL to include channelID, replikaData will fetch this to know which channel to send data back to
                      request.url = `/${DiscordMessageChannel}`;

                      discordClient.channels.cache.get(DiscordMessageChannel).startTyping();
                    }
                  }
                }
              })
              .catch(err => Utilities.createGeneralErrorMSG(err));
          } else {
              // Get submitted content's channel
              message.fetch({limit: 1}).then(messages => {
              DiscordMessageChannel = messages.channel.id;

              if(
                data &&
                data.DiscordChannel &&
                data.DiscordChannel == messages.channel.name &&
                data.RRequireAt == 'Disabled' ||
                (message.content.indexOf(ReplikaMentionIDFiltered) !== -1 ||
                 message.content.indexOf(ReplikaAlternateNames[0]) !== -1 ||
                 message.content.indexOf(ReplikaAlternateIDs[0]) !== -1)
              ) {
                if(messages.author != ReplikaAlternateIDs[0]) {
                  // Send message to replika via Playwright
                  let contentMSG = data.RRequireAt == 'Disabled' ? message.content : message.content.replace(message.content.slice(0, message.content.indexOf(' ') + 1), '');

                  // Check if message content contains only "upvote" or "downvote", if so, click the appropriate button on the last message
                  let upvoteMatchList = ['!Upvote','!upvote', '!Up Vote', '!up vote', '!up'];
                  let downvoteMatchList = ['!Downvote', '!downvote', '!Down Vote', '!down vote', '!down'];
                  let loveMatchList = ['!Love', '!love'];
                  let funnyMatchList = ['!Funny', '!funny'];
                  let meaninglessMatchList = ['!Meaningless', '!meaningless'];
                  let offensiveMatchList = ['!Offensive', '!offensive'];
                  let clearMatchList = ['!Clear', '!clear', '!Undo', '!undo'];

                  if(upvoteMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-upvote-button"]', 'None');
                  } else if(downvoteMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-downvote-button"]', 'None');
                  } else if (loveMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Love');
                  } else if (funnyMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Funny');
                  } else if (meaninglessMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Meaningless');
                  } else if (offensiveMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.clickElement(page, '[data-testid="chat-message-more-actions-button"]', 'Offensive');
                  } else if (clearMatchList.indexOf(contentMSG) !== -1) {
                    Utilities.resetClickElement(page);
                  } else {
                    page.click('#send-message-textarea');
                    // Prevent weird data from being entered
                    if(contentMSG.indexOf('<@') === -1) {
                      page.keyboard.type(`${contentMSG}\r`, { delay: 5 }); // Send message
                      
                      // Channel URL to include channelID, replikaData will fetch this to know which channel to send data back to
                      request.url = `/${DiscordMessageChannel}`;

                      discordClient.channels.cache.get(DiscordMessageChannel).startTyping();
                    }
                  }
                }
              }
            }).catch((err) => {Utilities.createGeneralErrorMSG(err)})
          }
        });
    }).catch((err) => {Utilities.createGeneralErrorMSG(err)})
  } catch(err) {Utilities.createGeneralErrorMSG(err)}
}

module.exports = DiscordBotRun;
