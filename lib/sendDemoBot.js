const {SERVER_URL} = process.env

const keywords = ['image', 'audio', 'video', 'file', 'button', 'element', 'quick reply', 'location']

const assetUrl = (path) => `${SERVER_URL}/public/${path}`

const sendDemoBot = {
  messageReceived: (event, chat, bot) => {
    bot.base.messageReceived(event, chat)
    const {sender, message: {text, attachments, quick_reply: quickReply}} = event
    const {template} = chat
    if (quickReply) {
      chat.send(sender.id, `You sent a quick reply with payload ${quickReply.payload}.`)
      return
    }
    if (attachments) {
      const location = attachments.find((attachment) => {
        return attachment.type === 'location'
      })
      if (location) {
        const {payload: {coordinates: {lat, long}}} = location
        chat.send(sender.id, `You sent a location with lat ${lat} and long ${long}.`)
        return
      }
    }
    if (/image/i.test(text)) {
      chat.sendImage(sender.id, assetUrl('image.jpg'))
    } else if (/audio/i.test(text)) {
      chat.sendAudio(sender.id, assetUrl('audio.mp3'))
    } else if (/video/i.test(text)) {
      chat.send(sender.id, 'Start sending video')
      .then(() => chat.sendTyping(sender.id))
      .then(() => chat.sendVideo(sender.id, assetUrl('video.mp4')))
      .then(() => chat.send(sender.id, 'Finish sending video'))
    } else if (/file/i.test(text)) {
      chat.sendFile(sender.id, assetUrl('file.pdf'))
    } else if (/button/i.test(text)) {
      chat.sendButtons(sender.id, 'Click one of the following buttons to continue', [
        template.url('https://developers.facebook.com/docs/messenger-platform', 'See messenger doc'),
        template.postback('POSTBACK_CLICKED', 'Test postback button')
      ])
    } else if (/element/i.test(text)) {
      chat.sendElements(sender.id, [
        template.element('https://amzn.com/0998289000', 'https://images-na.ssl-images-amazon.com/images/I/51F99bEgYJL._SX331_BO1,204,203,200_.jpg',
          'Conversational Interfaces: Principles of Successful Bots, Chatbots & Messaging Apps', 'by Mariya Yao', [
            template.url('https://amzn.com/0998289000', 'View on Amazon'),
            template.postback('BOOK_1', 'Select this book')
          ]
        ),
        template.element('https://amzn.com/0998289019', 'https://images-na.ssl-images-amazon.com/images/I/41jNBQRDXJL._SX331_BO1,204,203,200_.jpg',
          'Chatbots: 100 Successful Business and Brand Bots on Facebook Messenger, Slack, Skype, Kik, Amazon Echo, iMessage, and WeChat', 'by Adelyn Zhou et al.', [
            template.url('https://amzn.com/0998289019', 'View on Amazon'),
            template.postback('BOOK_2', 'Select this book')
          ]
        ),
        template.element('https://amzn.com/B01IOJ2KJM', 'https://images-na.ssl-images-amazon.com/images/I/41XPaqmhL7L.jpg',
          'Beginner guide to build chatbot using api.ai', 'by Amruta Mohite et al.', [
            template.url('https://amzn.com/B01IOJ2KJM', 'View on Amazon'),
            template.postback('BOOK_3', 'Select this book')
          ]
        )
      ])
    } else if (/quick reply/i.test(text)) {
      chat.send(sender.id, 'Choose a color', [
        template.quickReply('RED', 'Red'),
        template.quickReply('GREEN', 'Green'),
        template.quickReply('BLUE', 'Blue')
      ])
    } else if (/location/i.test(text)) {
      chat.sendLocationPrompt(sender.id, 'Please send a location')
    } else {
      chat.send(sender.id, `Please send a message containing one of the following keywords: ${keywords.join(', ')}`)
    }
  },
  postbackReceived: (event, chat, bot) => {
    bot.base.postbackReceived(event, chat)
    const {sender, postback: {payload}} = event
    chat.send(sender.id, `You sent a postback with payload ${payload}.`)
  }
}

module.exports = sendDemoBot
