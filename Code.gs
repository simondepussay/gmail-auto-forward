// Personnes qui reçoivent une copie de chaque nouvel e-mail
const RECIPIENTS = [
  "personne1@example.com",
  "personne2@example.com",
  "personne3@example.com"
];

// Expéditeurs à ne jamais transférer (newsletters, factures…)
const IGNORED_SENDERS = [
  "newsletter@example.com",
  "factures@example.com"
];

// Texte affiché en haut de chaque e-mail transféré
const HEADER_TITLE = "📩 Nouveau message reçu";
const HEADER_ORIGIN = "E-mail reçu sur l'adresse partagée.";

function forwardNewEmails() {

  let label = GmailApp.getUserLabelByName("Forwarded");
  if (!label) {
    label = GmailApp.createLabel("Forwarded");
  }

  const threads = GmailApp.search("newer_than:7d -label:Forwarded");

  threads.forEach(thread => {

    const messages = thread.getMessages();

    messages.forEach(message => {

      if (!message.isUnread()) {
        return;
      }

      const from = message.getFrom().toLowerCase();

      // Ignore les emails Google
      if (
        from.includes("@google.com") ||
        from.includes("@accounts.google.com") ||
        from.includes("google")
      ) {
        return;
      }

      // Ignore certains expéditeurs
      if (IGNORED_SENDERS.some(sender => from.includes(sender.toLowerCase()))) {
        return;
      }

      // Extraction du nom et de l'adresse e-mail
      const fromRaw = message.getFrom();

      let senderName = "";
      let senderEmail = fromRaw;

      const match = fromRaw.match(/^(.*)<(.+)>$/);

      if (match) {
        senderName = match[1].trim().replace(/^"|"$/g, "");
        senderEmail = match[2].trim();
      }

      const html = `
<div style="
  background:#f5f5f5;
  border-left:5px solid #1a73e8;
  padding:15px;
  margin-bottom:20px;
  font-family:Arial,sans-serif;
">

  <h2 style="margin-top:0;color:#1a73e8;">
    ${HEADER_TITLE}
  </h2>

  <p>
    <strong>Origine :</strong><br>
    ${HEADER_ORIGIN}
  </p>

  <p>
    <strong>Date de réception :</strong><br>
    ${message.getDate()}
  </p>

  <p>
    <strong>Objet :</strong><br>
    ${message.getSubject()}
  </p>

  <p>
    <strong>Expéditeur :</strong><br>

    <span style="
      font-size:18px;
      font-weight:bold;
      color:#1a73e8;
      font-family:monospace;
    ">
      ${senderEmail}
    </span>

    ${senderName ? `<br><span style="color:#666;">${senderName}</span>` : ""}
  </p>

  <p style="margin-top:20px;font-size:15px;">
    ⬇️ <strong>Si l'e-mail ne s'affiche pas entièrement</strong>, faites défiler vers le bas puis cliquez sur <strong>« Afficher le message entier »</strong> ou <strong>« Afficher la suite »</strong> (selon votre boîte de messagerie) afin de consulter l'intégralité du message.
  </p>

</div>

${message.getBody()}
`;

      MailApp.sendEmail({
        to: RECIPIENTS.join(","),
        subject: "📩 " + message.getSubject(),
        htmlBody: html,
        attachments: message.getAttachments()
      });

      // Marque le message comme lu
      message.markRead();

    });

    // Marque la conversation comme lue
    thread.markRead();

    // Évite les doublons
    thread.addLabel(label);

  });

}
