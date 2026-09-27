# 🟡 TP3 — Angular moderne : signals et composants

⏱️ Durée indicative : 3 h

Un seul composant qui fait tout devient vite illisible. Ce TP découpe l'écran en petits composants qui communiquent, avec ce que l'on trouve dans le code Angular d'aujourd'hui : les *signals*, `input()`, `output()` et le *control flow* (`@if`, `@for`).

## 1. Trier et rechercher dans `Library`

-   `booksSortedBy(field: SortField): Book[]` avec `type SortField = 'title' | 'author' | 'isbn'` :
    -   par titre, par auteur **puis** par titre, par ISBN
    -   triez une **copie** : `[...books].sort(...)`, car `sort` modifie le tableau sur place
    -   comparez les textes avec `a.localeCompare(b, 'fr')` (accents, majuscules)

Au lieu d'écrire une méthode par type de recherche, on veut **une seule** méthode `search`. Décrivez les critères avec une **union discriminée** (fichier `search-criteria.ts`) :

```ts
export type SearchCriteria =
  | { readonly kind: 'title'; readonly title: string }
  | { readonly kind: 'author'; readonly author: string }
  | { readonly kind: 'yearRange'; readonly from: number; readonly to: number };
```

Puis implémentez dans `Library` :

```ts
search(criteria: SearchCriteria): Book[] {
  return this.getBooks().filter((book) => {
    switch (criteria.kind) {
      case 'title':
        return // TODO : criteria.title existe ici, TypeScript le sait
      case 'author':
        return // TODO
      case 'yearRange':
        return // TODO
      default: {
        const unhandled: never = criteria;
        return unhandled;
      }
    }
  });
}
```

> Le `default` avec `never` ne s'exécute jamais : il sert au compilateur. Ajoutez un quatrième critère à l'union sans le traiter dans le `switch` : que se passe-t-il ? (C'est l'équivalent d'une `sealed interface` Java.)

## 2. Découper l'écran en composants

Générez les composants avec la CLI :

```bash
npx ng generate component book-list
npx ng generate component search-bar
```

| Composant | Reçoit (`input`) | Émet (`output`) | Rôle |
|---|---|---|---|
| `BookList` | `books: readonly Book[]` (obligatoire) | | affiche la liste, ou « Aucun livre ne correspond. » |
| `SearchBar` | | `search: string` | émet le texte à chaque frappe |
| `App` | | | tient l'état et assemble les deux |

```ts
// book-list.ts
readonly books = input.required<readonly Book[]>();

// search-bar.ts
readonly search = output<string>();
```

Dans `App`, l'état est fait de *signals*, et la liste affichée est **calculée** :

```ts
protected readonly query = signal('');
protected readonly sort = signal<SortField>('title');

protected readonly visibleBooks = computed(() => /* TODO : rechercher puis trier */);
```

```html
<app-search-bar (search)="query.set($event)" />
<app-book-list [books]="visibleBooks()" />
```

> Un *signal* se lit en l'appelant : `query()`. Quand il change, tout ce qui en dépend (`computed`, template) se met à jour tout seul.

## Reste à faire

### Exigences fonctionnelles

-   Une recherche par titre, sans tenir compte de la casse (« CLEAN » trouve « Clean Code »)
-   Un menu « Trier par » (titre, auteur, ISBN)
-   Quand une recherche est en cours, afficher « 1 résultat(s) pour « java » » (`@if`)

### Contraintes techniques

-   Tests unitaires pour les méthodes de tri (dont une bibliothèque vide) et un test par critère de recherche (`it.each` bienvenu)
-   Un test par composant :
    -   `BookList` : donnez-lui des livres avec `fixture.componentRef.setInput('books', [...])`, vérifiez l'affichage **et** le message de liste vide
    -   `SearchBar` : abonnez-vous à la sortie (`fixture.componentInstance.search.subscribe(...)`), tapez dans le champ, vérifiez ce qui est émis
    -   `App` : taper dans la recherche filtre la liste affichée

```ts
// Simuler une saisie dans un test
const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
input.value = 'clean';
input.dispatchEvent(new Event('input'));
await fixture.whenStable();
```

## Bonus

-   Rechercher aussi par auteur (un menu « Rechercher dans » titre / auteur), en réutilisant `search`
-   Mettre en gras le texte recherché dans chaque titre

## ✅ Terminé quand…

- [ ] Plus aucune boucle `for` dans `Library`
- [ ] `search(...)` gère les trois critères avec un `switch` qui ne compile plus si on en oublie un
- [ ] La liste se filtre pendant la saisie, et se trie
- [ ] Tous les tests passent dans la CI
