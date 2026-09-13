import promptSync from "prompt-sync";

const prompt = promptSync();

interface Shape {
    getArea(): number;
    getPerimeter(): number;
}

class Circle implements Shape {
    radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    scale(factor: number): void {
        this.radius *= factor;
    }
}

class Rectangle implements Shape {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }

    scale(factor: number): void {
        this.width *= factor;
        this.height *= factor;
    }
}

class Triangle implements Shape {
    sideA: number;
    sideB: number;
    sideC: number;

    constructor(sideA: number, sideB: number, sideC: number) {
        this.sideA = sideA;
        this.sideB = sideB;
        this.sideC = sideC;
    }

    getArea(): number {
        const s = this.getPerimeter() / 2;

        return Math.sqrt(
            s * (s - this.sideA) * (s - this.sideB) * (s - this.sideC)
        );
    }

    getPerimeter(): number {
        return this.sideA + this.sideB + this.sideC;
    }

    scale(factor: number): void {
        this.sideA *= factor;
        this.sideB *= factor;
        this.sideC *= factor;
    }
}

const radius = Number(prompt("Enter circle radius: "));

const width = Number(prompt("Enter rectangle width: "));
const height = Number(prompt("Enter rectangle height: "));

const sideA = Number(prompt("Enter triangle side A: "));
const sideB = Number(prompt("Enter triangle side B: "));
const sideC = Number(prompt("Enter triangle side C: "));

const scaleFactor = Number(prompt("Enter scale factor: "));

const circle = new Circle(radius);
const rectangle = new Rectangle(width, height);
const triangle = new Triangle(sideA, sideB, sideC);

const shapes: Shape[] = [circle, rectangle, triangle];

let totalArea = 0;
let totalPerimeter = 0;

for (const shape of shapes) {
    totalArea += shape.getArea();
    totalPerimeter += shape.getPerimeter();
}

console.log(`Total area: ${totalArea.toFixed(2)}`);
console.log(`Total perimeter: ${totalPerimeter.toFixed(2)}`);

circle.scale(scaleFactor);
rectangle.scale(scaleFactor);
triangle.scale(scaleFactor);

console.log("Shapes after scaling:");
console.log(`Circle radius: ${circle.radius.toFixed(2)}`);
console.log(`Rectangle: ${rectangle.width.toFixed(2)} x ${rectangle.height.toFixed(2)}`);
console.log(
    `Triangle sides: ${triangle.sideA.toFixed(2)}, ${triangle.sideB.toFixed(2)}, ${triangle.sideC.toFixed(2)}`
);