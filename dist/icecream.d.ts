type Size = 'small' | 'large';
type Topping = 'chocolate' | 'caramel' | 'berries';
type Extra = 'marshmallow';
interface Order {
    size: Size;
    toppings: Topping[];
    hasMarshmallow: boolean;
}
/**
 * Функція для розрахунку вартості морозива
 */
declare function calculateIceCreamCost(): void;
//# sourceMappingURL=icecream.d.ts.map