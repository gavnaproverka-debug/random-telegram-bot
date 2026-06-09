require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('❌ ОШИБКА: Токен не найден!');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('✅ Бот работает! Инлайн-режим готов');
    console.log('Бот получил /start от', ctx.from.username);
});

bot.on('inline_query', async (ctx) => {
    const queryText = ctx.inlineQuery.query.trim();
    console.log('🔍 Инлайн-запрос:', queryText);
    
    let min = 1;
    let max = 25;
    
    if (queryText) {
        const parts = queryText.split(/\s+/);
        if (parts.length >= 2) {
            const parsedMin = parseInt(parts[0]);
            const parsedMax = parseInt(parts[1]);
            if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
                min = parsedMin;
                max = parsedMax;
            }
        }
    }
    
    if (min > max) [min, max] = [max, min];
    
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const results = [{
        type: 'article',
        id: Date.now().toString(),
        title: `🎲 ${randomNumber}`,
        description: `от ${min} до ${max}`,
        input_message_content: {
            message_text: `📚 Билет : ${randomNumber}`
        }
    }];
    
    await ctx.answerInlineQuery(results, { cache_time: 0 });
    console.log('✅ Ответ отправлен, число:', randomNumber);
});

bot.launch();
console.log('🚀 Бот запущен!');