# Nasazení dotazníku (Firebase + statický hosting)

Web je čistě statický (HTML/CSS/JS) – žádný Node server neběží, vše se ukládá přímo z prohlížeče
do Firestore (Firebase). Stačí ho nahrát na jakýkoli webhosting nebo GitHub Pages.

## 1. Založ Firebase projekt (uděláš sám/sama – potřebuje přihlášení tvým Google účtem)

1. Jdi na https://console.firebase.google.com a vytvoř nový projekt (např. `tym-dotaznik`).
2. V levém menu **Build → Firestore Database** → *Create database* → zvol produkční režim
   (region klidně `eur3` / Evropa) → Enable.
3. V levém menu **Build → Authentication** → záložka *Sign-in method* → povol **Email/Password**.
4. Tamtéž záložka *Users* → *Add user* → zadej svůj e-mail a heslo. To bude účet, kterým se
   budeš přihlašovat na stránku s výsledky (`results.html`).
5. Zkopíruj si **UID** nově vytvořeného uživatele (zobrazí se ve sloupci User UID v seznamu Users).
6. V levém menu ozubené kolo → **Project settings** → dole *Your apps* → *Add app* → **Web (`</>`)**.
   Firebase ti vygeneruje `firebaseConfig` objekt.

## 2. Vlož konfiguraci a pravidla do projektu

1. Otevři [firebase-config.js](firebase-config.js) a nahraď placeholdery hodnotami z kroku 1.6.
2. Otevři [firestore.rules](firestore.rules), nahraď `ADMIN_UID_SEM` UID z kroku 1.5.
3. Ve Firebase Console jdi na **Firestore Database → Rules**, vlož obsah `firestore.rules` a klikni
   **Publish**.

Bez kroku 2.3 zůstávají výchozí pravidla, která čtení ani zápis nepovolí nikomu.

## 3. Nasazení statických souborů

### Varianta A – tvůj vlastní hosting
Nahraj celý obsah složky `web/` (index.html, results.html, style.css, app.js, results.js,
questions.js, firebase-config.js) do veřejně přístupné složky na svém webhostingu. Nic dalšího
se nemusí instalovat ani spouštět – žádný server-side kód.

### Varianta B – GitHub Pages
1. Vytvoř nový GitHub repozitář (klidně private i public – kód není citlivý, konfigurace Firebase
   běžně bývá veřejná).
2. Nahraj do něj obsah složky `web/`.
3. V nastavení repozitáře **Settings → Pages** nastav zdroj na `main` branch, `/ (root)`.
4. Po chvíli poběží na `https://<tvuj-github-login>.github.io/<nazev-repa>/`.

## 4. Vyzkoušení

- Otevři `index.html` (přes URL hostingu, ne přes `file://` – Firebase potřebuje http/https),
  projdi dotazník, odešli.
- Otevři `results.html`, přihlas se e-mailem/heslem z kroku 1.4, over že se odpověď zobrazila
  a že jde exportovat CSV.

## Poznámky k bezpečnosti a nákladům

- Firebase Firestore i Auth mají štědrý free tier (Spark plán) – pro dotazník od 6 lidí se do něj
  s velkou rezervou vejdeš zdarma.
- Firestore pravidla zajišťují, že cizí lidé mohou pouze **zapisovat** novou odpověď, ale nikdy
  nemohou nic **číst** ani upravovat – i kdyby znali strukturu databáze.
- `firebase-config.js` může být veřejně v repozitáři/na webu – nejde o tajný klíč, bezpečnost
  stojí na Firestore Rules a na tom, že jen ty máš přihlašovací údaje k adminskému účtu.
