const mineflayer = require('mineflayer');

const restrictedUsernames = ['robo2573', 'Master_Of_Pooms', 'caringchicken', 'samslacks'];

const config = {
  botOptions: {
    host: 'warg.minefort.com',
    port: 25565,
    version: '1.20.2',
    auth: 'microsoft',
    username: 'i-bday-theo@outlook.com',
    password: 'ianbday2023',
  },
};

let isReconnecting = false;
let isConnected = false;
let bot;
let shouldAdvertise = false;

function createBot() {
  bot = mineflayer.createBot(config.botOptions);

  bot.on('spawn', () => {
    console.log('Bot has spawned!');
    bot.chat('Im going to warg! Im so excited!');
    bot.chat('/join warg');
    isConnected = true;
  });

  bot.on('message', (message) => {
    console.log(`Received message: ${message.toString()}`);
  });

  bot.on('error', (err) => {
    console.error('Bot error:', err);
  });

  bot.on('debug', (message) => {
    console.log('Bot debug:', message);
  });

  bot.on('chat', (username, message) => {
    if (restrictedUsernames.includes(username)) {
      // Allowed users can interact with the bot
      console.log(`Chat event: ${username}: ${message}`);
      if (message.startsWith('!chat ')) {
        const chatMessage = message.slice(6);
        bot.chat(chatMessage);
        console.log(`Bot sent message: ${chatMessage}`);
      } else if (message.startsWith('!advertise')) {
        shouldAdvertise = true;
        bot.chat('Advertising will start now.');
      }
    } else {
      // Others receive an error message
      if (message.startsWith('!advertise') || message.startsWith('!chat')) {
        bot.chat("It's not like I'm a bot, dummy.");
      }
    }
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot has been kicked from the server. Reason: ${reason}`);
    isConnected = false;

    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(() => {
      createBot();
    }, 5000);
  });

  bot.on('end', (reason) => {
    console.log(`Bot has left the server. Reason: ${reason}`);
    isConnected = false;

    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(() => {
      createBot();
    }, 5000);
  });
}

// Set up console input listener
process.stdin.on('data', (input) => {
  if (isConnected) {
    const command = input.toString().trim();
    bot.chat(command);
    console.log(`Bot sent message: ${command}`);
  }
});

// Initial bot creation
createBot();
