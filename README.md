# Formation IA - outils et exercices

## Sommaire

- [1. OpenFox](#1-openfox)
  - [Installation](#installation-openfox)
  - [Connexion au modèle local](#connexion-au-modèle-local-openfox)
- [2. OpenCode](#2-opencode)
  - [Installation](#installation-opencode)
  - [Connexion au modèle local](#connexion-au-modèle-local-opencode)

---

## Pré-requis

* node 24 https://nodejs.org/fr/download

## 1. OpenFox

### Windows

Télécharge et lance : https://github.com/co-l/openfox/actions/runs/26528175669/artifacts/7247572762

### Installation

```bash
npm i -g openfox
```

Puis lance-le depuis la racine de tes projets (le dossier où y'a tous tes repo)

```bash
openfox
```

Tu as deux choix à ce moment : uniquement accessible sur localhost, ou accessible depuis le réseau local.

### Connexion au modèle local

Merlin est accessible à l'adresse `http://10.0.7.248:11434`. Voici comment le configurer dans l'interface d'OpenFox :

1. Lance OpenFox avec `openfox`, l'interface s'ouvre dans ton navigateur
2. La page s'ouvre sur **Providers**
3. Clique sur **Add Provider**
4. Renseigne les champs :
   - **Name** : `Merlin` (ou le nom que tu veux)
   - **Base URL** : `http://10.0.7.248:11434`
   - **API Key** : laisse vide
5. Clique sur le bouton "Add Provider" en bas
6. Termine l'onboarding (retour dessus à tout moment sur http://localhost:10369/onboarding )

OpenFox détecte automatiquement les modèles disponibles sur le serveur, il faudra le sélectionner dans la session.

> **Site :** [github.com/co-l/openfox](https://github.com/co-l/openfox)

---

## 2. OpenCode

### Installation

#### Linux / macOS / WSL

```bash
curl -fsSL https://opencode.ai/install | bash
```

#### Windows

```bash
npm i -g opencode-ai
```


### Connexion au modèle local

Crée un fichier `opencode.json` à la racine de ton projet :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "merlin": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Merlin",
      "options": {
        "baseURL": "http://10.0.7.248:11434/v1"
      },
      "models": {
        "cyankiwi/MiniMax-M2.7-AWQ-4bit": {
          "name": "cyankiwi/MiniMax-M2.7-AWQ-4bit"
        }
      }
    }
  }
}
```

Ensuite lance OpenCode dans le projet :

```bash
opencode
```

Puis utilise la commande `/models` dans l'interface pour sélectionner le modèle.

> **Site :** [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode) — [opencode.ai](https://opencode.ai)

---

## Liens utiles

| Outil     | Documentation                            |
| --------- | ---------------------------------------- |
| OpenFox   | https://github.com/co-l/openfox          |
| OpenCode  | https://github.com/anomalyco/opencode    |
