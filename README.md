# gmail-auto-forward

Petit script **Google Apps Script** qui transfère automatiquement les nouveaux e-mails d'une boîte Gmail à une liste de personnes.

Idéal pour une **adresse partagée** (projet de construction, association, famille…) : tout le monde reçoit les messages sans devoir se connecter à la boîte.

## Ce que fait le script

- Cherche les e-mails **non lus** des 7 derniers jours.
- Ignore les e-mails de Google et ceux des expéditeurs listés dans `IGNORED_SENDERS`.
- Envoie une copie à toutes les adresses de `RECIPIENTS`, avec :
  - un encadré en haut (date, objet, expéditeur),
  - le message original,
  - les pièces jointes.
- Marque le message comme lu et ajoute le libellé **`Forwarded`** pour ne jamais l'envoyer deux fois.

## Installation

1. Va sur [script.google.com](https://script.google.com) avec le compte Gmail à surveiller, puis clique sur **Nouveau projet**.
2. Colle le contenu de [`Code.gs`](Code.gs).
3. Modifie la configuration en haut du fichier :

   ```js
   const RECIPIENTS = ["personne1@example.com", "personne2@example.com"];
   const IGNORED_SENDERS = ["newsletter@example.com"];
   const HEADER_TITLE = "📩 Nouveau message reçu";
   const HEADER_ORIGIN = "E-mail reçu sur l'adresse partagée.";
   ```

4. Lance une première fois `forwardNewEmails` (bouton **Exécuter**) et accepte les autorisations Gmail.
5. Ajoute un déclencheur automatique : icône ⏰ **Déclencheurs**, puis **Ajouter un déclencheur**.
   - Fonction : `forwardNewEmails`
   - Source : *Déclencheur horaire*
   - Fréquence : *toutes les 5 ou 10 minutes*

C'est tout ✅

## Limites

- Un compte Gmail gratuit peut envoyer à environ **100 destinataires par jour** avec Apps Script. Chaque personne de `RECIPIENTS` compte pour un envoi.
- Le script ne regarde que les e-mails **non lus** : un message que tu as déjà ouvert avant son passage ne sera pas transféré.
- Le filtre Google ignore tout expéditeur dont l'adresse contient « google ».

## Licence

MIT
