# angular-pour-les-noobs

Dans cette série de TP, vous allez construire pas à pas l'**interface web** de la bibliothèque que vous avez codée côté serveur dans [java-pour-les-noobs](https://github.com/corentinbeuchet/java-pour-les-noobs) : d'abord en TypeScript pur, puis avec des tests automatisés, et enfin branchée sur votre API Spring Boot et testée de bout en bout dans un vrai navigateur.

## Ce que vous devez comprendre et savoir faire

- Écrire du TypeScript propre (types, interfaces, classes, `readonly`, unions)
- Créer des composants Angular et afficher des données avec `@if` et `@for`
- Écrire des tests unitaires utiles avec Vitest (cas nominaux, cas limites, tests paramétrés), y compris sur des composants
- Utiliser les *signals*, `input()` et `output()` pour faire communiquer des composants
- Appeler une API REST avec `HttpClient`, gérer ses erreurs et tester ces appels sans serveur
- Tester l'application de bout en bout avec Playwright, dans un vrai navigateur

## Prérequis

| Outil | Version |
|---|---|
| Node.js | 24 (LTS), version 24.15 ou plus, par exemple depuis [nodejs.org](https://nodejs.org/) : vérifiez avec `node -v` |
| npm | fourni avec Node.js |
| Angular | 22, installé par `npm ci` dans le projet (rien à installer globalement : on utilise `npm start`, `npm test`…) |
| IDE | VS Code (extension *Angular Language Service*) ou IntelliJ IDEA / WebStorm |
| API Java | votre projet java-pour-les-noobs du TP 4 ou du TP 5 (à partir du TP 4), ou celui d'un camarade, ou une API simulée : voir le TP 4 |

## Démarrer

1. Créez un dépôt **vide** sur votre compte GitHub (sans README).
2. Récupérez ce projet et poussez-le sur votre dépôt :

```bash
git clone https://github.com/corentinbeuchet/angular-pour-les-noobs.git
cd angular-pour-les-noobs
git remote set-url origin https://github.com/<votre-compte>/angular-pour-les-noobs.git
git push -u origin main
```

3. Installez les dépendances puis lancez l'application :

```bash
npm ci          # installe exactement les versions du package-lock.json
npm start       # http://localhost:4200
```

La page reste blanche : c'est normal. Ouvrez les outils de développement du navigateur (**F12**, onglet *Console*) : l'application s'arrête sur `Error: TODO 3 : addBook`. C'est à vous de jouer !

## Contenu

| TP | Sujet | Niveau | Durée indicative |
|---|---|---|---|
| [TP 1](TP1_TypeScript_Composant.md) | TypeScript et premier composant | 🟢 | 2 h |
| [TP 2](TP2_Tests_Vitest.md) | Erreurs & tests avec Vitest | 🟢 | 3 h |
| [TP 3](TP3_Angular_Moderne.md) | Angular moderne : signals et composants | 🟡 | 3 h |
| [TP 4](TP4_API_HttpClient.md) | Brancher l'API Spring Boot | 🟡 | 4 h |
| [TP 5](TP5_Tests_E2E_Playwright.md) | Tests de bout en bout avec Playwright | 🔴 | 4 h |

Chaque TP repart du code du TP précédent : travaillez dans **un seul dépôt** et ouvrez **une Pull Request par TP**.

## Les commandes du projet

| Commande | Rôle |
|---|---|
| `npm start` | lance l'application en développement sur http://localhost:4200 (rechargement automatique) |
| `npm test` | lance les tests unitaires (Vitest) et les relance à chaque modification ; `q` pour quitter |
| `npm run build` | construit la version de production dans `dist/` |

## Structure du projet

```text
.
├── angular.json          # configuration Angular (build, serveur, tests)
├── package.json          # dépendances et commandes npm
├── package-lock.json     # versions exactes installées (à committer)
├── public/               # fichiers statiques (favicon…)
└── src/
    ├── index.html
    ├── main.ts           # démarre l'application
    ├── styles.css        # styles globaux
    └── app/              # votre code
```
