import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { QUESTIONNAIRE } from "./questions.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ALL_QUESTIONS = QUESTIONNAIRE.flatMap((s) => s.questions);

const loginBox = document.getElementById("login-box");
const dataBox = document.getElementById("data-box");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const btnLogout = document.getElementById("btn-logout");
const btnExport = document.getElementById("btn-export");
const tableWrap = document.getElementById("table-wrap");
const countLabel = document.getElementById("count-label");

let cachedRows = [];

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.style.display = "none";
    dataBox.style.display = "block";
    loadResponses();
  } else {
    loginBox.style.display = "block";
    dataBox.style.display = "none";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.style.display = "none";
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "Přihlášení se nepovedlo: " + err.message;
    loginError.style.display = "block";
  }
});

btnLogout.addEventListener("click", () => signOut(auth));

function formatAnswer(q, raw) {
  if (raw === undefined || raw === null) return "";
  if (Array.isArray(raw)) {
    return raw.map((v) => (v === "__other__" ? "Jiné" : v)).join("; ");
  }
  if (raw === "__other__") return "Jiné";
  return String(raw);
}

async function loadResponses() {
  tableWrap.innerHTML = "Načítám...";
  try {
    const q = query(collection(db, "responses"), orderBy("submittedAt", "desc"));
    const snap = await getDocs(q);
    cachedRows = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      cachedRows.push({ id: docSnap.id, ...data });
    });
    countLabel.textContent = `Počet odpovědí: ${cachedRows.length}`;
    renderTable();
  } catch (err) {
    tableWrap.innerHTML = `<p class="error-msg" style="display:block;">Nepodařilo se načíst data: ${err.message}</p>`;
  }
}

function renderTable() {
  if (cachedRows.length === 0) {
    tableWrap.innerHTML = "<p>Zatím žádné odpovědi.</p>";
    return;
  }
  const header = `
    <tr>
      <th>Datum</th>
      <th>Jméno</th>
      ${ALL_QUESTIONS.map((q) => `<th>Q${q.id}</th>`).join("")}
    </tr>
  `;
  const rows = cachedRows
    .map((row) => {
      const date = row.submittedAt?.toDate ? row.submittedAt.toDate().toLocaleString("cs-CZ") : "";
      const cells = ALL_QUESTIONS.map((q) => {
        const raw = row.answers ? row.answers[q.id] : undefined;
        const other = row.answers ? row.answers[`${q.id}_other`] : undefined;
        let val = formatAnswer(q, raw);
        if (other) val += ` (${other})`;
        return `<td>${escapeHtml(val)}</td>`;
      }).join("");
      return `<tr><td>${date}</td><td>${escapeHtml(row.name || "")}</td>${cells}</tr>`;
    })
    .join("");

  tableWrap.innerHTML = `<div class="table-scroll"><table>${header}${rows}</table></div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toCsvValue(val) {
  const s = String(val ?? "");
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

btnExport.addEventListener("click", () => {
  const header = ["Datum", "Jmeno", ...ALL_QUESTIONS.map((q) => `Q${q.id}`)];
  const lines = [header.map(toCsvValue).join(";")];
  for (const row of cachedRows) {
    const date = row.submittedAt?.toDate ? row.submittedAt.toDate().toLocaleString("cs-CZ") : "";
    const cells = ALL_QUESTIONS.map((q) => {
      const raw = row.answers ? row.answers[q.id] : undefined;
      const other = row.answers ? row.answers[`${q.id}_other`] : undefined;
      let val = formatAnswer(q, raw);
      if (other) val += ` (${other})`;
      return toCsvValue(val);
    });
    lines.push([toCsvValue(date), toCsvValue(row.name || ""), ...cells].join(";"));
  }
  const csv = "﻿" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dotaznik_vysledky_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});
