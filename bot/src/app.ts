import Bot from "./lib/Bot";

let bot;

const main = async () => {
    bot = new Bot();
    await bot.start();
}

main();