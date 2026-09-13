interface LibraryItem {
    title: string;
    author: string;
    isBorrowed: boolean;
    borrow(): void;
}

class Book implements LibraryItem {
    title: string;
    author: string;
    pages: number;
    isBorrowed: boolean;

    constructor(title: string, author: string, pages: number) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Book "${this.title}" has been borrowed.`);
        } else {
            console.log(`Book "${this.title}" is already borrowed.`);
        }
    }
}

class Magazine implements LibraryItem {
    title: string;
    author: string;
    issueNumber: number;
    isBorrowed: boolean;

    constructor(title: string, author: string, issueNumber: number) {
        this.title = title;
        this.author = author;
        this.issueNumber = issueNumber;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Magazine "${this.title}" has been borrowed.`);
        } else {
            console.log(`Magazine "${this.title}" is already borrowed.`);
        }
    }
}

class DVD implements LibraryItem {
    title: string;
    author: string;
    duration: number;
    isBorrowed: boolean;

    constructor(title: string, author: string, duration: number) {
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`DVD "${this.title}" has been borrowed.`);
        } else {
            console.log(`DVD "${this.title}" is already borrowed.`);
        }
    }
}

class Library {
    private items: LibraryItem[];

    constructor() {
        this.items = [];
    }

    addItem(item: LibraryItem): void {
        this.items.push(item);
    }

    findItemByName(name: string): LibraryItem | undefined {
        return this.items.find(
            item => item.title.toLowerCase() === name.toLowerCase()
        );
    }

    showAvailableItems(): void {
        console.log("\nAvailable library items:");

        const availableItems = this.items.filter(item => !item.isBorrowed);

        if (availableItems.length === 0) {
            console.log("No available items.");
            return;
        }

        for (const item of availableItems) {
            console.log(`${item.title} by ${item.author}`);
        }
    }
}

const library = new Library();

const book = new Book("Pride and Prejudice", "Jane Austen", 432);
const magazine = new Magazine("Vogue", "Anna Wintour", 125);
const dvd = new DVD("Titanic", "James Cameron", 194);

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);

library.showAvailableItems();

book.borrow();

library.showAvailableItems();

const foundItem = library.findItemByName("Titanic");

if (foundItem) {
    console.log(`\nFound item: ${foundItem.title} by ${foundItem.author}`);
}

dvd.borrow();

library.showAvailableItems();