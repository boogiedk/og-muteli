async function loadServerInfo() {
    try {
        const response = await fetch('/serverinfo');
        const serverInfo = await response.json();

        const title = document.querySelector('h1');
        title.textContent = serverInfo.name; // Устанавливаем название сервера в заголовок
    } catch (error) {
        console.error('Ошибка загрузки информации о сервере:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/users');
        const channels = await response.json();

        const channelsContainer = document.getElementById('channels');
        channelsContainer.innerHTML = ''; // Очищаем предыдущие данные

        for (const [channelName, users] of Object.entries(channels)) {
            // Создаем блок для канала
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel');

            // Добавляем название канала
            const channelTitle = document.createElement('h2');
            channelTitle.textContent = `Канал: ${channelName || 'Неизвестный'}`; // Обрабатываем undefined
            channelDiv.appendChild(channelTitle);

            // Создаем список пользователей
            const userList = document.createElement('ul');
            userList.classList.add('users');

            users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user;
                userList.appendChild(userItem);
            });

            channelDiv.appendChild(userList);
            channelsContainer.appendChild(channelDiv);
        }
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
}

// Загружаем информацию о сервере и пользователей при загрузке страницы
window.onload = function() {
    loadServerInfo();
    loadUsers();
};
