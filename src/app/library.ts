import { Book } from './book';

export class Library {
  private readonly books: Book[] = [];

  addBook(book: Book): void {
    // TODO 3 : ajouter un livre
    throw new Error('TODO 3 : addBook');
  }

  getBooks(): readonly Book[] {
    // TODO 4 : retourner tous les livres
    throw new Error('TODO 4 : getBooks');
  }

  findBookByTitle(title: string): Book | undefined {
    // TODO 5 : rechercher un livre par son titre (undefined s'il n'existe pas)
    throw new Error('TODO 5 : findBookByTitle');
  }
}
