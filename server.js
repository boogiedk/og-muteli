const express = require('express');
const { TeamSpeak } = require("ts3-nodejs-library");

const app = express();
const port = 81;

// Устанавливаем путь для статических файлов (HTML, CSS, JS)
app.use(express.static('public'));

// Конфигурация для подключения к TeamSpeak 3 серверу
const ts3 = new TeamSpeak({
    host: "193.104.57.84", // IP адрес вашего TS3 сервера
    queryport: 10011, // Порт для Query
    serverport: 9987, // Порт TS3 сервера
    username: "ts_monitoring", // Ваш логин для Query
    password: "AR6OBtTs", // Ваш пароль для Query
    nickname: "ts_monitoring"
});

// Эндпоинт для получения списка пользователей и их каналов
app.get('/users', async (req, res) => {
    try {
        // Получаем список клиентов (пользователей) на сервере
        const clients = await ts3.clientList({ clientType: 0 });
        const channels = await ts3.channelList();

        // Формируем ответ в виде объекта, где ключ — канал, а значение — пользователи
        let channelUsers = {};

        // Инициализируем все каналы с пустыми массивами
        channels.forEach(channel => {
            const channelName = channel.propcache.channelName;
            channelUsers[channelName] = []; // Создаем массив для пользователей в канале
        });

        // Заполняем пользователей в соответствующих каналах
        clients.forEach(client => {
            const channel = channels.find(c => c.cid === client.cid);
            const channelName = channel && channel.propcache && channel.propcache.channelName
                ? channel.propcache.channelName
                : 'Неизвестный';

            // Добавляем пользователя в список канала
            channelUsers[channelName].push(client.nickname);
        });

        // Если в канале никого нет, добавляем текст <пусто>
        for (const channel in channelUsers) {
            if (channelUsers[channel].length === 0) {
                channelUsers[channel].push('<пусто>');
            }
        }

        res.json(channelUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка получения данных с TS3 сервера');
    }
});



// Эндпоинт для получения названия сервера
app.get('/serverinfo', async (req, res) => {
    try {
        const serverInfo = await ts3.serverInfo();
        res.json({ name: serverInfo.virtualserverName });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка получения информации о сервере');
    }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://193.104.57.84:${port}`);
});
