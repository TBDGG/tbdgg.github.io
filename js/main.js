// Данные украшений для магазина
const decorations = [
    { id: 1, name: "Звезда", icon: "⭐", price: 50 },
    { id: 2, name: "Луна", icon: "🌙", price: 75 },
    { id: 3, name: "Комета", icon: "☄️", price: 100 },
    { id: 4, name: "Планета", icon: "🪐", price: 150 },
    { id: 5, name: "НЛО", icon: "🛸", price: 200 },
    { id: 6, name: "Ракета", icon: "🚀", price: 120 },
    { id: 7, name: "Спутник", icon: "🛰️", price: 80 },
    { id: 8, name: "Астероид", icon: "🌠", price: 60 },
    { id: 9, name: "Галактика", icon: "🌌", price: 300 },
    { id: 10, name: "Созвездие", icon: "🔭", price: 180 },
    { id: 11, name: "Молния", icon: "⚡", price: 90 },
    { id: 12, name: "Огонь", icon: "🔥", price: 70 },
    { id: 13, name: "Вода", icon: "💧", price: 65 },
    { id: 14, name: "Воздух", icon: "💨", price: 55 },
    { id: 15, name: "Земля", icon: "🌍", price: 85 },
    { id: 16, name: "Кольцо", icon: "💫", price: 110 },
    { id: 17, name: "Кристалл", icon: "🔮", price: 160 },
    { id: 18, name: "Ключ", icon: "🔑", price: 95 },
    { id: 19, name: "Замо́к", icon: "🔒", price: 45 },
    { id: 20, name: "Сердце", icon: "💖", price: 130 },
    { id: 21, name: "Медаль", icon: "🏅", price: 140 },
    { id: 22, name: "Кубок", icon: "🏆", price: 250 },
    { id: 23, name: "Флаг", icon: "🚩", price: 40 },
    { id: 24, name: "Якорь", icon: "⚓", price: 75 },
    { id: 25, name: "Часы", icon: "⏰", price: 65 },
    { id: 26, name: "Зонт", icon: "☂️", price: 50 },
    { id: 27, name: "Снежинка", icon: "❄️", price: 35 },
    { id: 28, name: "Цветок", icon: "🌺", price: 45 },
    { id: 29, name: "Лист", icon: "🍃", price: 30 },
    { id: 30, name: "Радуга", icon: "🌈", price: 220 }
];

// Проверка авторизации пользователя
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('guestSection').style.display = 'none';
        document.getElementById('userName').textContent = userData.username;
        document.getElementById('userCoins').textContent = userData.coins || 0;
        
        // Загружаем магазин если пользователь авторизован
        loadShop();
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Прокрутка к играм
function scrollToGames() {
    document.getElementById('games').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Показать информацию о возможностях
function showFeatureInfo() {
    const featureInfo = document.getElementById('featureInfo');
    featureInfo.style.display = featureInfo.style.display === 'none' ? 'grid' : 'none';
}

// Открыть страницу игры
function openGame(gameSlug) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert('Пожалуйста, войдите в систему чтобы играть!');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `games/${gameSlug}.html`;
}

// Загрузка магазина
function loadShop() {
    const decorationsGrid = document.getElementById('decorationsGrid');
    if (!decorationsGrid) return;

    decorationsGrid.innerHTML = decorations.map(decoration => `
        <div class="shop-item" onclick="buyDecoration(${decoration.id})">
            <div class="item-icon">${decoration.icon}</div>
            <h4>${decoration.name}</h4>
            <div class="item-price">${decoration.price} WCoins</div>
        </div>
    `).join('');
}

// Покупка смены аватара
function buyAvatarChange() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Пожалуйста, войдите в систему!');
        return;
    }

    const cost = 100;
    if (user.coins < cost) {
        alert('Недостаточно WCoins!');
        return;
    }

    const newAvatar = prompt('Введите URL нового аватара:');
    if (newAvatar) {
        // Обновляем пользователя
        user.coins -= cost;
        user.avatar = newAvatar;
        
        // Обновляем в localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Обновляем интерфейс
            document.getElementById('userCoins').textContent = user.coins;
            document.getElementById('userAvatar').src = user.avatar;
            
            alert('Аватар успешно изменен!');
        }
    }
}

// Покупка украшения
function buyDecoration(decorationId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Пожалуйста, войдите в систему!');
        return;
    }

    const decoration = decorations.find(d => d.id === decorationId);
    if (!decoration) return;

    if (user.coins < decoration.price) {
        alert('Недостаточно WCoins!');
        return;
    }

    // Проверяем, есть ли уже это украшение
    if (!user.decorations) user.decorations = [];
    
    if (user.decorations.includes(decorationId)) {
        alert('У вас уже есть это украшение!');
        return;
    }

    // Покупка
    user.coins -= decoration.price;
    user.decorations.push(decorationId);
    
    // Обновляем в localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Обновляем интерфейс
        document.getElementById('userCoins').textContent = user.coins;
        alert(`Украшение "${decoration.name}" успешно приобретено!`);
    }
}

// Начисление WCoins за игру
function addCoins(amount, gameName) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    user.coins = (user.coins || 0) + amount;
    
    // Обновляем в localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        console.log(`Начислено ${amount} WCoins за игру: ${gameName}`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});
