import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { QUESTIONNAIRE } from "./questions.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const root = document.getElementById("app-root");

let sectionIndex = 0;
const answers = {}; // { [questionId]: value }
let submitted = false;

function fieldName(q) {
  return `q_${q.id}`;
}

function renderScale(q) {
  const current = answers[q.id];
  const opts = [1, 2, 3, 4, 5]
    .map((n) => {
      const checked = current === n ? "checked" : "";
      return `
        <div class="scale-option">
          <label>
            <input type="radio" name="${fieldName(q)}" value="${n}" ${checked} />
            <span>${n}</span>
          </label>
        </div>`;
    })
    .join("");
  const captionLeft = q.scaleLabels?.[1] ?? "";
  const captionRight = q.scaleLabels?.[5] ?? "";
  return `
    <div class="scale-row">${opts}</div>
    <div class="scale-caption"><span>${captionLeft}</span><span>${captionRight}</span></div>
  `;
}

function renderRadio(q) {
  const otherValue = answers[`${q.id}_other`] || "";
  const current = answers[q.id];
  const opts = q.options
    .map((opt) => {
      const checked = current === opt ? "checked" : "";
      return `
        <label class="choice-option">
          <input type="radio" name="${fieldName(q)}" value="${escapeAttr(opt)}" ${checked} />
          <span>${escapeHtml(opt)}</span>
        </label>`;
    })
    .join("");
  const otherChecked = current === "__other__" ? "checked" : "";
  const otherBlock = q.allowOther
    ? `
      <label class="choice-option">
        <input type="radio" name="${fieldName(q)}" value="__other__" ${otherChecked} />
        <span>Jiné</span>
      </label>
      <input type="text" class="other-input" data-other-for="${q.id}" placeholder="Doplňte..." value="${escapeAttr(otherValue)}" />
    `
    : "";
  return `${opts}${otherBlock}`;
}

function renderCheckbox(q) {
  const current = answers[q.id] || [];
  const otherValue = answers[`${q.id}_other`] || "";
  const opts = q.options
    .map((opt) => {
      const checked = current.includes(opt) ? "checked" : "";
      return `
        <label class="choice-option">
          <input type="checkbox" name="${fieldName(q)}" value="${escapeAttr(opt)}" ${checked} />
          <span>${escapeHtml(opt)}</span>
        </label>`;
    })
    .join("");
  const otherChecked = current.includes("__other__") ? "checked" : "";
  const otherBlock = q.allowOther
    ? `
      <label class="choice-option">
        <input type="checkbox" name="${fieldName(q)}" value="__other__" ${otherChecked} />
        <span>Jiné</span>
      </label>
      <input type="text" class="other-input" data-other-for="${q.id}" placeholder="Doplňte..." value="${escapeAttr(otherValue)}" />
    `
    : "";
  return `${opts}${otherBlock}`;
}

function renderTextarea(q) {
  const val = answers[q.id] || "";
  return `<textarea name="${fieldName(q)}" placeholder="Vaše odpověď...">${escapeHtml(val)}</textarea>`;
}

function renderNumberPct(q) {
  const val = answers[q.id] ?? "";
  return `
    <div class="pct-wrap">
      <input type="number" min="0" max="100" step="1" name="${fieldName(q)}" value="${val}" placeholder="0-100" />
      <span>%</span>
    </div>`;
}

function renderName(q) {
  const val = answers[q.id] || "";
  return `<input type="text" name="${fieldName(q)}" value="${escapeAttr(val)}" placeholder="Jméno (nepovinné, necháte-li prázdné = anonymní)" />`;
}

function renderQuestion(q) {
  const req = q.required ? '<span class="required-mark">*</span>' : "";
  let body = "";
  switch (q.type) {
    case "scale5":
      body = renderScale(q);
      break;
    case "radio":
      body = renderRadio(q);
      break;
    case "checkbox":
      body = renderCheckbox(q);
      break;
    case "textarea":
      body = renderTextarea(q);
      break;
    case "number_pct":
      body = renderNumberPct(q);
      break;
    case "name":
      body = renderName(q);
      break;
  }
  return `
    <div class="question" data-qid="${q.id}" data-qtype="${q.type}">
      <div class="question-text">${escapeHtml(q.text)}${req}</div>
      ${body}
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function renderSection() {
  const section = QUESTIONNAIRE[sectionIndex];
  const isLast = sectionIndex === QUESTIONNAIRE.length - 1;
  const progressPct = Math.round((sectionIndex / QUESTIONNAIRE.length) * 100);

  root.innerHTML = `
    <div class="progress"><div class="progress-bar" style="width:${progressPct}%"></div></div>
    <div class="card">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      ${section.intro ? `<p class="section-intro">${escapeHtml(section.intro)}</p>` : ""}
      <form id="section-form">
        ${section.questions.map(renderQuestion).join("")}
        <div id="error-box" class="error-msg" style="display:none;"></div>
        <div class="nav-row" style="${isLast ? "justify-content: flex-end;" : ""}">
          ${isLast ? "" : `<button type="button" id="btn-back" class="btn-secondary" ${sectionIndex === 0 ? "disabled" : ""}>Zpět</button>`}
          <button type="submit" id="btn-next" class="btn-primary">${isLast ? "Odeslat dotazník" : "Pokračovat"}</button>
        </div>
      </form>
    </div>
  `;

  const backBtn = document.getElementById("btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      collectSection(section, { validate: false });
      sectionIndex = Math.max(0, sectionIndex - 1);
      renderSection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.getElementById("section-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!collectSection(section, { validate: true })) return;
    if (isLast) {
      submitQuestionnaire();
    } else {
      sectionIndex += 1;
      renderSection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function collectSection(section, { validate } = { validate: true }) {
  const form = document.getElementById("section-form");
  const errorBox = document.getElementById("error-box");
  errorBox.style.display = "none";

  const fail = (msg) => {
    if (!validate) return true; // silent save (e.g. Back button): never block, just skip below
    return showError(errorBox, msg);
  };

  for (const q of section.questions) {
    if (q.type === "scale5" || q.type === "radio") {
      const checked = form.querySelector(`input[name="${fieldName(q)}"]:checked`);
      if (!checked) {
        if (q.required && !fail("Vyplňte prosím všechny povinné otázky (*).")) return false;
        delete answers[q.id];
        continue;
      }
      let value = checked.value;
      if (q.type === "scale5") value = Number(value);
      if (value === "__other__") {
        const otherInput = form.querySelector(`[data-other-for="${q.id}"]`);
        answers[`${q.id}_other`] = otherInput ? otherInput.value.trim() : "";
      } else {
        delete answers[`${q.id}_other`];
      }
      answers[q.id] = value;
    } else if (q.type === "checkbox") {
      const checkedEls = Array.from(form.querySelectorAll(`input[name="${fieldName(q)}"]:checked`));
      if (checkedEls.length === 0) {
        if (q.required && !fail("Vyplňte prosím všechny povinné otázky (*).")) return false;
        delete answers[q.id];
        continue;
      }
      const values = checkedEls.map((el) => el.value);
      if (values.includes("__other__")) {
        const otherInput = form.querySelector(`[data-other-for="${q.id}"]`);
        answers[`${q.id}_other`] = otherInput ? otherInput.value.trim() : "";
      } else {
        delete answers[`${q.id}_other`];
      }
      answers[q.id] = values;
    } else if (q.type === "number_pct") {
      const input = form.querySelector(`input[name="${fieldName(q)}"]`);
      const raw = input.value.trim();
      if (raw === "") {
        if (q.required && !fail("Vyplňte prosím všechny povinné otázky (*).")) return false;
        delete answers[q.id];
        continue;
      }
      const num = Number(raw);
      if (Number.isNaN(num) || num < 0 || num > 100) {
        if (!fail("Zadejte prosím procento mezi 0 a 100.")) return false;
        delete answers[q.id];
        continue;
      }
      answers[q.id] = num;
    } else if (q.type === "textarea" || q.type === "name") {
      const el = form.querySelector(`[name="${fieldName(q)}"]`);
      const val = el.value.trim();
      if (val === "") {
        if (q.required && !fail("Vyplňte prosím všechny povinné otázky (*).")) return false;
        delete answers[q.id];
        continue;
      }
      answers[q.id] = val;
    }
  }
  return true;
}

function showError(box, msg) {
  box.textContent = msg;
  box.style.display = "block";
  return false;
}

async function submitQuestionnaire() {
  if (submitted) return;
  const btn = document.getElementById("btn-next");
  btn.disabled = true;
  btn.textContent = "Odesílám...";

  const nameQuestionId = QUESTIONNAIRE.flatMap((s) => s.questions).find((q) => q.type === "name").id;
  const name = answers[nameQuestionId] || "";
  const answerPayload = {};
  for (const [key, value] of Object.entries(answers)) {
    if (key === String(nameQuestionId)) continue; // jméno jde do vlastního pole
    answerPayload[key] = value;
  }

  const timeout = (ms) =>
    new Promise((_, reject) => setTimeout(() => reject(new Error("Vypršel časový limit.")), ms));

  try {
    await Promise.race([
      addDoc(collection(db, "responses"), {
        name: name || null,
        answers: answerPayload,
        submittedAt: serverTimestamp(),
      }),
      timeout(20000),
    ]);
    submitted = true;
    renderThanks();
  } catch (err) {
    console.error(err);
    const errorBox = document.getElementById("error-box");
    showError(errorBox, "Odeslání se nepovedlo. Zkontrolujte prosím připojení a zkuste to znovu.");
    btn.disabled = false;
    btn.textContent = "Odeslat dotazník";
  }
}

function renderThanks() {
  root.innerHTML = `
    <div class="progress"><div class="progress-bar" style="width:100%"></div></div>
    <div class="card thanks">
      <h2>Děkujeme za vyplnění!</h2>
      <p>Vaše odpovědi byly odeslány. Formulář je nyní uzavřen a nelze se vracet ani upravovat předchozí odpovědi.</p>
      <p class="small-note">Pokud jste uvedli jméno, je uloženo pouze pro moji potřebu a výsledky budu vyhodnocovat souhrnně.</p>
    </div>
  `;
}

renderSection();
