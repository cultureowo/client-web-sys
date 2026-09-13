interface Animal {
    name: string;
    age: number;
    move(): void;
}

class Cat implements Animal {
    name: string;
    age: number;
    hasFur?: boolean;

    constructor(name: string, age: number, hasFur?: boolean) {
        this.name = name;
        this.age = age;
        this.hasFur = hasFur;
    }

    move(): void {
        console.log(`${this.name} walks.`);
    }
}

class Bird implements Animal {
    name: string;
    age: number;
    canFly?: boolean;

    constructor(name: string, age: number, canFly?: boolean) {
        this.name = name;
        this.age = age;
        this.canFly = canFly;
    }

    move(): void {
        console.log(`${this.name} flies.`);
    }
}

class Fish implements Animal {
    name: string;
    age: number;
    waterType?: string;

    constructor(name: string, age: number, waterType?: string) {
        this.name = name;
        this.age = age;
        this.waterType = waterType;
    }

    move(): void {
        console.log(`${this.name} swims.`);
    }
}

const cat = new Cat("Luna", 3, true);
const bird = new Bird("Sky", 2, true);
const fish = new Fish("Nemo", 1, "freshwater");

cat.move();
bird.move();
fish.move();