import { Component } from '@angular/core';
import { Book, createBook, describeBook } from './book';
import { Library } from './library';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly library = new Library();

  protected readonly books: readonly Book[];

  constructor() {
    this.library.addBook(createBook('Clean Code', 'Robert C. Martin', 2008));
    this.library.addBook(createBook('Effective Java', 'Joshua Bloch', 2018));
    this.books = this.library.getBooks();
  }

  // Une fonction importée n'est pas visible dans le template : on l'expose par une propriété.
  protected readonly describeBook = describeBook;
}
