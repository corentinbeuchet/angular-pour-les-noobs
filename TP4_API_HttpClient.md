# 🟡 TP4 — Brancher l'API Spring Boot

⏱️ Durée indicative : 4 h

Jusqu'ici, les livres vivaient en mémoire dans le navigateur. On branche maintenant l'interface sur **votre** API REST de [java-pour-les-noobs](https://github.com/corentinbeuchet/java-pour-les-noobs) (TP 4, ou TP 5 avec PostgreSQL).

## 1. Démarrer l'API

Dans votre projet Java : `./gradlew bootRun`. Vérifiez http://localhost:8080/books : vous devez voir du JSON.

| Requête | Réponse |
|---|---|
| `GET /books?sort=title` (ou `author`, `isbn`) | `200` + la liste triée |
| `POST /books` (livre en JSON) | `201`, ou `409` si l'ISBN existe déjà |
| `DELETE /books/{isbn}` | `204`, ou `404` si le livre n'existe pas |

Les erreurs arrivent au format `ProblemDetail` : `{ "status": 409, "detail": "ISBN déjà présent : …" }`.

> 💡 **Pas d'API Java ?** (vous n'avez pas fait java-pour-les-noobs, ou elle ne démarre pas) Vous n'êtes pas bloqué : **simulez le service**, comme en entreprise quand le back n'est pas encore prêt. Écrivez une classe `FakeBookApi` avec les mêmes méthodes que `BookApi`, qui garde les livres dans un tableau et renvoie `of(...)`, ou `throwError(() => new HttpErrorResponse({ status: 409, error: { detail: '…' } }))` pour une erreur. Puis dans `app.config.ts`, ajoutez `{ provide: BookApi, useClass: FakeBookApi }` aux `providers`. C'est le même principe que le faux `BookApi` de vos tests, mais pour l'application.
>
> Respectez **le contrat du tableau ci-dessus** (codes, tri, `detail`) : le jour où l'API existe, vous retirez cette ligne de `app.config.ts` et rien d'autre ne change. Seule exigence que vous ne pourrez pas vérifier : le message « API non démarrée » (le `502` du proxy). Ce n'est pas grave.

## 2. Le proxy de développement

L'application Angular tourne sur le port 4200, l'API sur le 8080. Pour le navigateur, ce sont deux origines différentes : il bloquerait les appels (CORS). En développement, on demande à `ng serve` de **transmettre** les appels à l'API. Créez `proxy.conf.json` à la racine :

```json
{
  "/books": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

Puis dans `angular.json`, ajoutez l'option au serveur (`projects > angular-pour-les-noobs > architect > serve > options`) :

```json
"options": {
  "proxyConfig": "proxy.conf.json"
}
```

Relancez `npm start`. Le code appellera simplement `/books`.

> ⚠️ Conséquence : les **pages** de l'application ne doivent pas commencer par `/books`, sinon un rafraîchissement (F5) serait envoyé à l'API. Nos pages s'appellent donc `/livres` et `/livres/ajouter`.

## 3. Code de départ

### 📄 app.config.ts

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient()],
};
```

### 📄 book-api.ts

```ts
@Injectable({ providedIn: 'root' })
export class BookApi {
  private readonly http = inject(HttpClient);

  getBooks(sort: SortField): Observable<Book[]> {
    return this.http.get<Book[]>('/books', { params: { sort } });
  }

  // TODO 6 : addBook(book: Book): Observable<Book>
  // TODO 7 : deleteBook(isbn: string): Observable<void>
}
```

> `HttpClient` renvoie un `Observable` : la requête ne part que quand on s'y **abonne** (`subscribe`).

### 📄 app.routes.ts

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'livres', pathMatch: 'full' },
  { path: 'livres', component: BookListPage, title: 'Livres' },
  // TODO 8 : la page livres/ajouter
  { path: '**', redirectTo: 'livres' },
];
```

## Reste à faire

### Exigences fonctionnelles

-   `App` ne garde que l'en-tête, un menu (`routerLink`) et `<router-outlet />`
-   Page **liste** (`BookListPage`, `/livres`) : les livres viennent de l'API, triés par le champ choisi (le tri est fait par l'API) ; la recherche du TP 3 filtre toujours dans le navigateur ; un bouton « Supprimer » par livre
-   Page **ajout** (`BookFormPage`, `/livres/ajouter`) : un formulaire ISBN, titre, auteur, année ; après un ajout réussi, retour à la liste
-   Les erreurs de l'API s'affichent à l'utilisateur avec le **motif** envoyé par l'API (le champ `detail`) : ISBN en double (409), livre introuvable (404)
-   Si l'API n'est pas démarrée, un message le dit clairement au lieu d'une page vide. Attention : dans ce cas, c'est le proxy de `ng serve` qui répond, avec un code `502` (Bad Gateway) et sans `detail`

### Contraintes techniques

-   Formulaire avec les [formulaires réactifs](https://angular.dev/guide/forms/reactive-forms) (`FormGroup`, `Validators`) : ISBN obligatoire, 13 chiffres (`Validators.pattern(/^\d{13}$/)`) ; titre et auteur obligatoires ; bouton désactivé tant que le formulaire est invalide
-   Tests de `BookApi` **sans serveur**, avec `HttpTestingController` : pour chaque méthode, vérifiez l'URL, la méthode HTTP et le corps envoyé, puis simulez la réponse, erreur 409 comprise :

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
const http = TestBed.inject(HttpTestingController);
// ...
const request = http.expectOne('/books?sort=author');
expect(request.request.method).toBe('GET');
request.flush([/* la réponse simulée */]);
```

-   Tests des pages avec un **faux** `BookApi` (`{ provide: BookApi, useValue: { getBooks: vi.fn(() => of([...])) } }`) : la liste affiche ce que l'API renvoie, changer le tri rappelle l'API, un 409 affiche son motif dans le formulaire
-   Les tests des TP précédents passent toujours, et la CI aussi (elle n'a **pas** besoin de l'API : c'est le rôle des faux)

## Bonus

-   Un indicateur « Chargement… » pendant l'appel
-   Une page de détail `/livres/:isbn` (lisez [`withComponentInputBinding`](https://angular.dev/guide/routing/common-router-tasks#getting-route-information))

## ✅ Terminé quand…

- [ ] Avec l'API démarrée (ou simulée), on peut lister, trier, ajouter et supprimer des livres
- [ ] Ajouter un ISBN existant affiche le motif renvoyé par l'API
- [ ] Chaque ligne du tableau de l'API est couverte par un test, sans serveur
- [ ] Les tests des TP 2 et 3 passent toujours
