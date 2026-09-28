# 🔴 TP5 — Tests de bout en bout avec Playwright

⏱️ Durée indicative : 4 h

Vos tests unitaires vérifient chaque pièce séparément, dans un faux navigateur (jsdom). Il reste à vérifier que **tout fonctionne ensemble**, dans un vrai navigateur, comme un utilisateur : c'est le rôle des tests **de bout en bout** (*end-to-end*, « e2e »), ici avec [Playwright](https://playwright.dev/).

## 1. Installer Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Créez `playwright.config.ts` à la racine :

```ts
import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:4200', trace: 'on-first-retry' },
  projects: [
    { name: 'mock', use: { ...devices['Desktop Chrome'] }, grepInvert: /@fullstack/ },
    { name: 'fullstack', use: { ...devices['Desktop Chrome'] }, grep: /@fullstack/ },
  ],
  // Playwright démarre lui-même l'application avant les tests
  webServer: { command: 'npm start', url: 'http://localhost:4200', reuseExistingServer: !CI, timeout: 120_000 },
});
```

Et les commandes dans `package.json` :

```json
"e2e": "playwright test --project=mock",
"e2e:fullstack": "playwright test --project=fullstack",
"e2e:ui": "playwright test --ui"
```

> Les tests e2e sont dans `e2e/`, en dehors de `src/` : `npm test` (Vitest) ne les voit pas, et Playwright ne voit pas les tests unitaires.

## 2. Premier test

📄 `e2e/books.spec.ts` :

```ts
import { expect, test } from '@playwright/test';

test('affiche les livres de l\'API', async ({ page }) => {
  // L'API est simulée : Playwright intercepte les appels du navigateur vers /books
  await page.route(/\/books(\?.*)?$/, (route) =>
    route.fulfill({
      json: [{ isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', year: 2008 }],
    }),
  );

  await page.goto('/livres');

  await expect(page.getByText('Clean Code - Robert C. Martin (2008)')).toBeVisible();
});
```

Lancez `npm run e2e`, puis `npm run e2e:ui` : vous voyez le navigateur dérouler le test, étape par étape.

> Cherchez les éléments comme un utilisateur les voit : `getByRole('button', { name: 'Ajouter' })`, `getByLabel('ISBN')`, `getByText(...)`. Évitez les sélecteurs CSS fragiles (`div > ul > li:nth-child(2)`).

## Reste à faire

### Exigences fonctionnelles (un test e2e par ligne)

| Scénario | Ce que l'on vérifie |
|---|---|
| Afficher la liste | les livres de l'API, triés par titre ; la requête envoyée est `GET /books?sort=title` |
| Trier par auteur | la liste change et l'API a reçu `?sort=author` |
| Rechercher | la liste se filtre pendant la saisie |
| Ajouter un livre | le `POST` contient le livre saisi, puis on revient sur `/livres` et le livre y est |
| ISBN en double | le motif de l'API (409) s'affiche, on reste sur le formulaire |
| Supprimer | le livre disparaît de la liste |
| API arrêtée | un message prévient l'utilisateur (le proxy répond `502` : `route.fulfill({ status: 502 })`) |

### Contraintes techniques

-   Une **fausse API** réutilisable (`e2e/fake-book-api.ts`) : une classe qui garde les livres en mémoire, répond comme l'API Java (200, 201, 204, 404, 409 + `detail`) et **enregistre les requêtes reçues** pour que les tests les vérifient
-   Un **Page Object** (`e2e/library-pages.ts`) : les tests appellent `library.addBook(...)`, `library.sortBy('auteur')`… et ne contiennent aucun sélecteur
-   Aucun `page.waitForTimeout(...)` : les `expect` de Playwright attendent tout seuls que la page soit prête
-   Ajoutez un job `e2e` à la CI, à côté du job `test` :

```yaml
  e2e:
    runs-on: ubuntu-26.04
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - uses: actions/upload-artifact@v7
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
```

### Pour de vrai : avec votre API Java

La CI n'a pas d'API Java : elle utilise la fausse. Si vous avez simulé l'API au TP 4, cette partie est facultative. Sinon, en local, vérifiez aussi l'application complète. Dans `e2e/fullstack.spec.ts`, taguez les tests `@fullstack` dans leur titre (`test.describe('avec l\'API Spring Boot @fullstack', ...)`), démarrez PostgreSQL et l'API (java-pour-les-noobs, TP 5), puis `npm run e2e:fullstack` :

-   la liste affiche les livres d'exemple de la base (dont Clean Code)
-   ajouter puis supprimer un livre fonctionne réellement (utilisez un ISBN différent à chaque exécution : la base garde les données)

## ✅ Terminé quand…

- [ ] `npm run e2e` passe en local **et** dans la CI, sans API Java
- [ ] Les 7 scénarios du tableau sont couverts
- [ ] `npm run e2e:fullstack` passe avec une API Java démarrée (la vôtre ou celle d'un camarade)
- [ ] Le rapport Playwright est disponible dans les artefacts de la CI
