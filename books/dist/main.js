"use strict";
class Book {
    constructor(title, author) {
        Book._count++;
        this.id = Book._count;
        this.title = title;
        this.author = author;
        this.createdAt = Date.now();
    }
    getInfo() {
        return `${this.title} ${this.author} ID: ${this.id}`;
    }
}
Book._count = 0;
class Library {
    constructor() {
        this.books = [];
    }
    add(book) {
        this.books.push(book);
    }
    list() {
        return this.books;
    }
    size() {
        return this.books.length;
    }
    exists(title, author) {
        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].title === title && this.books[i].author === author) {
                return true;
            }
        }
        return false;
    }
}
class App {
    constructor(lib) {
        this.lib = lib;
        this.title = this.must("#title");
        this.author = this.must("#author");
        this.addBtnEl = this.must("#addBtn");
        this.counterEl = this.must("#counter");
        this.cardsEl = this.must("#cards");
        this.errorEl = this.must("#error");
        this.addBtnEl.addEventListener("click", () => this.onAdd());
    }
    onAdd() {
        const titleValue = this.normalize(this.title.value);
        const authorValue = this.normalize(this.author.value);
        if (!titleValue || !authorValue) {
            this.setError("Вы не ввели автора или название книги");
            return;
        }
        if (this.lib.exists(titleValue, authorValue)) {
            this.setError("Такая книга уже есть в списке");
            return;
        }
        this.setError("");
        const book = new Book(titleValue, authorValue);
        this.lib.add(book);
        this.title.value = "";
        this.author.value = "";
        this.render();
    }
    setError(msg) {
        this.errorEl.textContent = msg;
    }
    normalize(s) {
        return s.trim();
    }
    must(selector) {
        const el = document.querySelector(selector);
        if (!el)
            throw new Error(`Элемент ${selector} не найден`);
        return el;
    }
    render() {
        this.counterEl.textContent = String(Book._count);
        this.cardsEl.innerHTML = "";
        for (const st of this.lib.list()) {
            const card = document.createElement("div");
            card.className = "card";
            const name = document.createElement("div");
            name.className = "name";
            name.textContent = `${st.title} ${st.author} ID: ${st.id}`;
            card.append(name);
            this.cardsEl.append(card);
        }
    }
}
new App(new Library());
