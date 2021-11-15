require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`
Привет, ${ctx.message.from.first_name}!
Узнай статистику по коронавирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно по команде /help.
`,
Markup.keyboard([
    ['Russia', 'US'],
    ['Ukraine', 'Kazakhstan']
])
.resize()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);

        const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
        `;
    
        console.log(formatData);
        ctx.reply(formatData);
    } catch(e) {
        console.log('Error!');
        ctx.reply('Ошибка! Такой страны не существует! Посмотрите /help');
    }
    
});

bot.launch();
console.log('Bot is running...');