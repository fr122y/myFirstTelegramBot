const TelegramApi = require("node-telegram-bot-api")
const { gameOptions, againOptions } = require ("./options")
const token = "5480075341:AAHqv8G0hp7rspcXTu_z7UdrZf3MWXDLtdI"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async  (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать")
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай, я готов", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: '/info', description: "Получить информацию о боте"},
        {command: '/game', description: "Сыграть в игру"},
    ])
    
    bot.on("message" ,async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === "/start"){
            await bot.sendMessage(chatId, `Добро пожаловать в мой первый бот телеграм!`)
            return bot.sendPhoto(chatId, "https://sun9-3.userapi.com/impf/v34ZYGLbVo79i2QYuXoDSY1-YyfZRyZmc04Png/770J5rMyq3Y.jpg?size=455x640&quality=96&sign=5ee44c6790361fec04cf780a0ed3c488&type=album")
        }
        if(text === "/info"){
            return bot.sendMessage(chatId, `СООБЩЕНИЕ`)
        }
        if (text === "/game"){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, "Нихуя не понял, давай по новой!")
    } )

    bot.on("callback_query",async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id
        
        if (data === "/again"){
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
           return bot.sendMessage (chatId, `Поздравляю, ты угадал, число и впрямь ${chats[chatId]}`, againOptions)
        }
        else{
           return bot.sendMessage(chatId, `К сожалению ты проиграл, мое число ${chats[chatId]}, сыграем еще раз?`, againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}

start()