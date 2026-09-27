/**
 * Un livre de la bibliothèque.
 * Une interface décrit la forme d'un objet : elle n'existe plus une fois le code compilé en JavaScript.
 */
export interface Book {
  readonly title: string;
  readonly author: string;
  readonly year: number;
}

export function createBook(title: string, author: string, year: number): Book {
  // TODO 1 : refuser un titre vide ou fait d'espaces (throw new Error('Titre invalide'))
  return { title, author, year };
}

export function describeBook(book: Book): string {
  // TODO 2 : retourner par exemple « Clean Code - Robert C. Martin (2008) »
  throw new Error('TODO 2 : describeBook');
}
