abstract class Employee {
    public name: string;
    protected age: number;
    protected salary: number;

    constructor(name: string, age: number, salary: number) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    abstract getAnnualBonus(): number;
}

interface Payable {
    pay(): void;
}

class Developer extends Employee implements Payable {
    constructor(name: string, age: number, salary: number) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.10;
    }

    pay(): void {
        console.log(`${this.name} receives a salary of ${this.salary} UAH.`);
    }
}

class Manager extends Employee implements Payable {
    constructor(name: string, age: number, salary: number) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.20;
    }

    pay(): void {
        console.log(`${this.name} receives a salary of ${this.salary} UAH.`);
    }
}

const employees: Employee[] = [
    new Developer("Alex", 25, 50000),
    new Developer("Emma", 28, 60000),
    new Manager("Daniel", 35, 80000),
    new Manager("Sophia", 32, 90000)
];

let totalBonus = 0;

for (const employee of employees) {
    totalBonus += employee.getAnnualBonus();
}

console.log(`Total annual bonuses: ${totalBonus} UAH`);

for (const employee of employees) {
    if (employee instanceof Developer || employee instanceof Manager) {
        employee.pay();
    }
}