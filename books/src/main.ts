class Book {
    static _count = 0

    public readonly id: number
    public readonly title: string
    public readonly author: string
    public readonly createdAt: number

    constructor(title: string, author: string) {
        Book._count++
        this.id = Book._count
        this.title = title
        this.author = author
        this.createdAt = Date.now()
    }

    public getInfo(): string {
        return `${this.title} ${this.author} ID: ${this.id}`
    }
}

class Library {
    private books: Book [] = []

    public add(book: Book): void {
        this.books.push(book)
    }

    public list(): readonly Book[] {
        return this.books
    }

    public size(): number {
        return this.books.length
    }

    public exists(title: string, author: string): boolean {
        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].title === title && this.books[i].author === author) {
                return true
            }
        }
        return false
    }
}

class App {
    private title: HTMLInputElement
    private author: HTMLInputElement
    private addBtnEl: HTMLButtonElement
    private counterEl: HTMLSpanElement
    private cardsEl: HTMLDivElement
    private errorEl: HTMLDivElement

    constructor(private lib: Library){
        this.title = this.must<HTMLInputElement>("#title")
        this.author = this.must<HTMLInputElement>("#author")
        this.addBtnEl = this.must<HTMLButtonElement>("#addBtn")
        this.counterEl = this.must<HTMLSpanElement>("#counter")
        this.cardsEl = this.must<HTMLDivElement>("#cards")
        this.errorEl = this.must<HTMLDivElement>("#error")

        this.addBtnEl.addEventListener("click", () => this.onAdd())
    }
    private onAdd(): void {
        const titleValue = this.normalize(this.title.value)
        const authorValue = this.normalize(this.author.value)

        if (!titleValue || !authorValue) {
            this.setError("Вы не ввели автора или название книги")
            return
        }

        if (this.lib.exists(titleValue, authorValue)) {
            this.setError("Такая книга уже есть в списке")
            return
        }

        this.setError("")
        const book = new Book(titleValue, authorValue)
        this.lib.add(book)

        this.title.value = ""
        this.author.value = ""

        this.render()
    }
    private setError(msg: string){
        this.errorEl.textContent = msg
    }
    private normalize(s: string): string {
        return s.trim()
    }
    private must<T extends Element>(selector: string): T {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`Элемент ${selector} не найден`)
        return el as T
    }

    private render(): void {
        this.counterEl.textContent = String(Book._count)
        this.cardsEl.innerHTML = ""

        for (const st of this.lib.list()){
            const card = document.createElement("div")
            card.className = "card"

            const name = document.createElement("div")
            name.className = "name"
            name.textContent = `${st.title} ${st.author} ID: ${st.id}`

            card.append(name)
            this.cardsEl.append(card)
        }
    }
}

new App(new Library())