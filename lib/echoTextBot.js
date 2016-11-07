const echoBot = {
  messageReceived: (event, chat) => {
    const {sender, message} = event
    if (message.text) {
      chat.send(sender.id, `${chat.botInfo.id} received "${message.text}".`)
    } else {
      chat.send(sender.id, 'Sorry, I can echo text messages only!')
    }
  }
}

module.exports = echoBot
