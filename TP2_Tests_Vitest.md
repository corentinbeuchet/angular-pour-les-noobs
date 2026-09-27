# 🟢 TP2 — Erreurs & tests avec Vitest

⏱️ Durée indicative : 3 h

## 1. Vitest est déjà prêt

Depuis Angular 21, les projets sont créés avec [Vitest](https://vitest.dev/) : rien à installer. Les tests sont les fichiers `*.spec.ts`, placés **à côté** du code qu'ils testent (`library.ts` → `library.spec.ts`).

| Commande | Rôle |
|---|---|
| `npm test` | lance les tests et les relance à chaque modification (`q` pour quitter) |
| `npm test -- --watch=false` | les lance une seule fois (c'est ce que fera la CI) |
| `npm test -- --coverage` | mesure la couverture : rapport dans `coverage/` |

## 2. Test fourni

Créez `src/app/library.spec.ts` :

```ts
import { createBook } from './book';
import { Library } from './library';

describe('Library', () => {
  it('trouve un livre par son titre', () => {
    const library = new Library();
    library.addBook(createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008));

    const book = library.findBookByTitle('Clean Code');

    expect(book?.isbn).toBe('9780132350884');
  });
});
```

Lancez `npm test` : le test doit passer.

> `describe`, `it` et `expect` n'ont pas besoin d'import : Angular les déclare globalement pour les fichiers de test (`tsconfig.spec.json`).

## 3. Reste à faire

### Exigences fonctionnelles

-   Remplacer le tableau par une `Map<string, Book>` indexée par ISBN (les tests doivent rester verts : c'est tout l'intérêt des tests)
-   Créer une hiérarchie d'erreurs dans `errors.ts` :
    -   `LibraryError extends Error`
    -   `BookNotFoundError extends LibraryError` : livre absent (recherche, suppression). `findByIsbn` et `findBookByTitle` ne renvoient plus `undefined` : elles lèvent cette erreur.
    -   `DuplicateBookError extends LibraryError` : ISBN déjà présent
-   Donnez à chaque erreur un `name` (`override readonly name = 'BookNotFoundError'`) : c'est ce qui s'affiche dans la console et dans les messages de test

### Contraintes techniques

-   Des tests unitaires pertinents pour chaque méthode de `Library` et pour `createBook`
-   Au moins un test paramétré avec [`it.each`](https://vitest.dev/api/#test-each)
-   Tests des cas limites indispensables : ISBN vide ou fait d'espaces, doublon, livre absent, bibliothèque vide…
-   Vérifier le **type** d'erreur, pas seulement qu'il y en a une : `expect(() => ...).toThrow(BookNotFoundError)`
-   Un test du composant `App` : le titre et un élément de liste par livre. Point de départ :

```ts
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('affiche un élément de liste par livre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable(); // attend que le template soit affiché

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBe(2);
  });
});
```

-   Ajouter la CI pour lancer les tests automatiquement : créez `.github/workflows/ci.yml` :

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-26.04
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm test -- --watch=false
      - run: npm run build
```

-   Bloquer le merge si la CI ne passe pas : ajoutez le check `test` (le nom du job) aux règles de protection de `main`

> ⚠️ `npm ci` échoue si `package-lock.json` ne correspond pas à `package.json` : après avoir ajouté une dépendance avec `npm install <paquet>`, committez **les deux** fichiers.

### Bonus

-   Tester `isValidIsbn13` avec un `it.each` qui donne la raison de chaque refus : `{ isbn: '978-0132350884', reason: 'tiret' }` et `'refuse $isbn ($reason)'` dans le nom du test
-   Lancer la couverture (`npm test -- --coverage`) : quelle ligne n'est jamais exécutée par vos tests ?

## ✅ Terminé quand…

- [ ] `npm test -- --watch=false` passe en local **et** dans la CI
- [ ] Chaque erreur de la hiérarchie est couverte par au moins un test
- [ ] Au moins un `it.each` teste plusieurs ISBN invalides
- [ ] Une Pull Request dont la CI est rouge ne peut pas être mergée
