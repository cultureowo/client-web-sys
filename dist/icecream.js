"use strict";
/**
 * Функція для розрахунку вартості морозива
 */
function calculateIceCreamCost() {
    // 1. Отримання розміру стаканчика
    const sizeInput = prompt("Оберіть розмір морозива:\n1 - Маленький (10 грн)\n2 - Великий (25 грн)");
    let size;
    if (sizeInput === '1' || sizeInput?.toLowerCase() === 'маленький') {
        size = 'small';
    }
    else if (sizeInput === '2' || sizeInput?.toLowerCase() === 'великий') {
        size = 'large';
    }
    else {
        alert("Було обрано невірний розмір. Спробуйте ще раз.");
        return;
    }
    // 2. Отримання начинок (мінімум одна)
    const toppingsInput = prompt("Оберіть начинки (введіть через кому або пробіл):\n" +
        "1 - Шоколад (+5 грн)\n" +
        "2 - Карамель (+6 грн)\n" +
        "3 - Ягоди (+10 грн)\n" +
        "Приклад: 1, 3");
    const toppings = [];
    if (toppingsInput) {
        const items = toppingsInput.toLowerCase().split(/[\s,]+/);
        if (items.includes('1') || items.includes('шоколад'))
            toppings.push('chocolate');
        if (items.includes('2') || items.includes('карамель'))
            toppings.push('caramel');
        if (items.includes('3') || items.includes('ягоди'))
            toppings.push('berries');
    }
    // Перевірка наявності хоча б однієї начинки
    if (toppings.length === 0) {
        alert("Помилка: потрібно обрати щонайменше одну начинку!");
        return;
    }
    // 3. Додатково маршмелоу (не обов'язково)
    const marshmallowInput = prompt("Бажаєте додати маршмелоу (+5 грн)?\nВведіть 'так' або 'плюс', якщо так.");
    const hasMarshmallow = marshmallowInput !== null &&
        ['так', 'yes', '+', '1'].includes(marshmallowInput.trim().toLowerCase());
    // 4. Розрахунок вартості
    let totalCost = 0;
    // Вартість розміру
    if (size === 'small') {
        totalCost += 10;
    }
    else {
        totalCost += 25;
    }
    // Вартість начинок
    toppings.forEach(topping => {
        switch (topping) {
            case 'chocolate':
                totalCost += 5;
                break;
            case 'caramel':
                totalCost += 6;
                break;
            case 'berries':
                totalCost += 10;
                break;
        }
    });
    // Вартість маршмелоу
    if (hasMarshmallow) {
        totalCost += 5;
    }
    // Виведення результату
    alert(`Загальна вартість вашого морозива складає: ${totalCost} грн.`);
}
// Виклик функції
calculateIceCreamCost();
//# sourceMappingURL=icecream.js.map