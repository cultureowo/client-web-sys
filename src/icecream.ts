import promptSync from "prompt-sync";

const prompt = promptSync();

let price = 0;

const size = prompt("Choose ice cream size (small/large): ");

if (size.toLowerCase() === "small") {
    price += 10;
} else if (size.toLowerCase() === "large") {
    price += 25;
}

const toppings = prompt(
    "Choose topping (chocolate/caramel/berries). You can choose several separated by commas: "
);

const selectedToppings = toppings
    .toLowerCase()
    .split(",")
    .map(topping => topping.trim());

for (const topping of selectedToppings) {
    if (topping === "chocolate") {
        price += 5;
    } else if (topping === "caramel") {
        price += 6;
    } else if (topping === "berries") {
        price += 10;
    }
}

const marshmallow = prompt("Add marshmallow? (y/n): ");

if (marshmallow.toLowerCase() === "y") {
    price += 5;
}

console.log(`Ice cream price: ${price} UAH`);

