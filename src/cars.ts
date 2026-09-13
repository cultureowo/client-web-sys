abstract class Car {
    public brand: string;
    protected engine: string;
    private year: number;

    constructor(brand: string, engine: string, year: number) {
        this.brand = brand;
        this.engine = engine;
        this.year = year;
    }

    abstract describe(): void;

    protected getYear(): number {
        return this.year;
    }
}

class Porsche extends Car {
    public model: string;
    protected horsepower: number;
    private topSpeed: number;

    constructor(
        model: string,
        engine: string,
        year: number,
        horsepower: number,
        topSpeed: number
    ) {
        super("Porsche", engine, year);
        this.model = model;
        this.horsepower = horsepower;
        this.topSpeed = topSpeed;
    }

    describe(): void {
        console.log(
            `Porsche ${this.model} | Engine: ${this.engine} | Year: ${this.getYear()} | Horsepower: ${this.horsepower} HP | Top speed: ${this.topSpeed} km/h`
        );
    }
}

class Ferrari extends Car {
    public model: string;
    protected horsepower: number;
    private topSpeed: number;

    constructor(
        model: string,
        engine: string,
        year: number,
        horsepower: number,
        topSpeed: number
    ) {
        super("Ferrari", engine, year);
        this.model = model;
        this.horsepower = horsepower;
        this.topSpeed = topSpeed;
    }

    describe(): void {
        console.log(
            `Ferrari ${this.model} | Engine: ${this.engine} | Year: ${this.getYear()} | Horsepower: ${this.horsepower} HP | Top speed: ${this.topSpeed} km/h`
        );
    }
}

class Dodge extends Car {
    public model: string;
    protected horsepower: number;
    private topSpeed: number;

    constructor(
        model: string,
        engine: string,
        year: number,
        horsepower: number,
        topSpeed: number
    ) {
        super("Dodge", engine, year);
        this.model = model;
        this.horsepower = horsepower;
        this.topSpeed = topSpeed;
    }

    describe(): void {
        console.log(
            `Dodge ${this.model} | Engine: ${this.engine} | Year: ${this.getYear()} | Horsepower: ${this.horsepower} HP | Top speed: ${this.topSpeed} km/h`
        );
    }
}

const porsche911 = new Porsche(
    "911 GT3 RS",
    "4.0L Flat-6",
    2024,
    518,
    296
);

const porsche918 = new Porsche(
    "918 Spyder",
    "4.6L V8 Hybrid",
    2015,
    887,
    345
);

const ferrariSF90 = new Ferrari(
    "SF90 Stradale",
    "4.0L V8 Hybrid",
    2024,
    986,
    340
);

const ferrariLaFerrari = new Ferrari(
    "LaFerrari",
    "6.3L V12 Hybrid",
    2015,
    950,
    350
);

const dodgeDemon = new Dodge(
    "Challenger SRT Demon 170",
    "6.2L Supercharged V8",
    2023,
    1025,
    326
);

const dodgeViper = new Dodge(
    "Viper ACR",
    "8.4L V10",
    2017,
    645,
    285
);

porsche911.describe();
porsche918.describe();

ferrariSF90.describe();
ferrariLaFerrari.describe();

dodgeDemon.describe();
dodgeViper.describe();