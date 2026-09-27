# 🟢 TP1 — TypeScript et premier composant

⏱️ Durée indicative : 2 h

## Point de départ

Le projet compile déjà. Tout se passe dans `src/app/` :

```text
src/app/
├── app.ts        # le composant racine : crée la bibliothèque et lui ajoute deux livres
├── app.html      # son template : la liste des livres
├── book.ts       # à compléter (TODO 1 et 2)
└── library.ts    # à compléter (TODO 3 à 5)
```

Lancez `npm start` puis ouvrez http://localhost:4200 avec la console du navigateur (**F12**) : l'application s'arrête sur le premier `TODO`. Remplacez chaque `throw new Error(...)` par votre code, jusqu'à ce que la page affiche les deux livres. La page se recharge toute seule à chaque enregistrement.

> 💡 TypeScript, c'est JavaScript **plus des types**. Survolez une variable dans l'IDE : vous voyez son type. Une erreur de type est signalée **avant** d'exécuter le code, comme en Java.

## Reste à faire

### Exigences fonctionnelles

-   Rajouter l'identifiant [ISBN](https://fr.wikipedia.org/wiki/International_Standard_Book_Number) (ISBN-13 : 13 chiffres, sans tirets) à l'interface `Book`. La fonction de création devient :
    ```ts
    export function createBook(isbn: string, title: string, author: string, year: number): Book
    ```
    Mettez ensuite `app.ts` à jour avec les ISBN : `9780132350884` (Clean Code) et `9780134685991` (Effective Java).
-   Refuser un ISBN ou un titre vide ou fait d'espaces : `throw new Error('ISBN invalide')`, `throw new Error('Titre invalide')`
-   Ajouter et supprimer des livres
-   Rechercher par titre, par auteur et par ISBN
-   Garantir l'unicité de l'ISBN dans la bibliothèque
-   L'ISBN ne doit pas pouvoir être modifié après création

La classe `Library` doit exposer au minimum ces méthodes (elles seront utilisées par les tests du TP 2) :

| Méthode | Rôle |
|---|---|
| `addBook(book: Book): void` | ajoute un livre |
| `removeBook(isbn: string): void` | supprime un livre |
| `findByIsbn(isbn: string): Book \| undefined` | recherche par ISBN |
| `findBookByTitle(title: string): Book \| undefined` | recherche par titre |
| `findByAuthor(author: string): Book[]` | tous les livres d'un auteur |
| `containsIsbn(isbn: string): boolean` | l'ISBN est-il présent ? |
| `size(): number` | nombre de livres |
| `getBooks(): readonly Book[]` | tous les livres |

### Dans le template

-   Afficher le nombre de livres au-dessus de la liste
-   Afficher « Aucun livre pour l'instant. » quand la liste est vide : regardez le bloc `@empty` de [`@for`](https://angular.dev/guide/templates/control-flow#providing-a-fallback-for-for-blocks-with-the-empty-block)
-   `track book.isbn` plutôt que `track book.title` : pourquoi ? Répondez dans la Pull Request.

### Contraintes techniques

-   Pas de `any` : chaque paramètre et chaque retour a un type
-   Encapsulation : la liste des livres est `private` ; `getBooks()` ne doit pas permettre de la modifier de l'extérieur
-   Préférez les méthodes des tableaux (`find`, `filter`, `some`…) aux boucles `for`
-   Protéger la branche `main` de votre dépôt GitHub : passage obligatoire par une Pull Request (pas besoin de review, c'est un TP individuel)

### Bonus

-   Vérifier la [clé de contrôle](https://fr.wikipedia.org/wiki/International_Standard_Book_Number#Cl%C3%A9_de_contr%C3%B4le) de l'ISBN-13 dans une fonction `isValidIsbn13(isbn: string): boolean` (fichier `isbn.ts`)

## ✅ Terminé quand…

- [ ] La page affiche les deux livres, sans erreur dans la console
- [ ] Un ISBN déjà présent ne peut pas être ajouté une deuxième fois
- [ ] `npm run build` passe sans erreur ni `any`
- [ ] Votre travail est arrivé sur `main` par une Pull Request
