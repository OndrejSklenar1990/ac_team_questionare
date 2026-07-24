// Datový model dotazníku. Sekce se zobrazují jako jednotlivé kroky (stránky) formuláře.
// Typy otázek:
//   'scale5'    - škála 1-5 (radio), volitelně reverse: true jen pro popisek u vyhodnocení
//   'number_pct'- číslo 0-100 %
//   'radio'     - výběr jedné možnosti z options, allowOther přidá textové pole "Jiné"
//   'checkbox'  - výběr více možností z options, allowOther přidá textové pole "Jiné"
//   'textarea'  - volný text
//   'name'      - nepovinné textové pole na jméno (jen v poslední sekci)

export const QUESTIONNAIRE = [
  {
    key: "A",
    title: "A. Alokace a vytížení",
    questions: [
      {
        id: 1,
        type: "scale5",
        required: true,
        text: "Jak byste ohodnotili své aktuální pracovní vytížení?",
        scaleLabels: { 1: "výrazně podvytížen/a", 3: "tak akorát", 5: "přetížen/a" },
      },
      {
        id: 2,
        type: "number_pct",
        required: true,
        text: "Odhadem kolik procent svého pracovního fondu máte v posledních 2–3 týdnech reálně alokováno na konkrétní úkoly/projekty?",
      },
      {
        id: 3,
        type: "radio",
        required: true,
        allowOther: true,
        text: "Pokud nejste plně alokováni, co je hlavní důvod?",
        options: [
          "Nemám zadané úkoly / čekám na přidělení práce",
          "Čekám na vstupy/rozhodnutí od někoho jiného",
          "Priority nejsou jasné",
          "Práce mi nezabere celý fond, ale nevím o čem jiném",
        ],
      },
      {
        id: 4,
        type: "radio",
        required: true,
        text: "Když zrovna nemáte formální úkol, víte na čem byste měli/mohli pracovat?",
        options: ["Ano", "Ne", "Částečně"],
      },
      {
        id: 5,
        type: "textarea",
        required: false,
        text: "Co by vám pomohlo lépe využívat volnou kapacitu?",
      },
    ],
  },
  {
    key: "B",
    title: "B. Sdílení informací a komunikace",
    questions: [
      {
        id: 6,
        type: "scale5",
        required: true,
        text: "Jak často sdílíte informace o tom, na čem pracujete, s týmem (mimo formální status)?",
        scaleLabels: { 1: "nikdy", 5: "pravidelně" },
      },
      {
        id: 7,
        type: "scale5",
        required: true,
        text: "Do jaké míry si myslíte, že tým má reálný přehled o tom, co právě děláte?",
        scaleLabels: { 1: "vůbec", 5: "velmi dobrý přehled" },
      },
      {
        id: 8,
        type: "radio",
        required: false,
        text: "Myslíte si, že někteří lidé v týmu nesdílí informace a drží si věci raději pro sebe?",
        options: ["Ano", "Ne", "Nevím / nechci se vyjadřovat"],
      },
      {
        id: 9,
        type: "scale5",
        required: true,
        text: "Máte obavu nebo strach sdílet své know-how s ostatními v týmu?",
        scaleLabels: { 1: "vůbec ne", 5: "ano, výrazně" },
      },
      {
        id: 10,
        type: "scale5",
        required: true,
        text: "Když se potřebujete poradit, jdete nejdříve dovnitř týmu, nebo raději kontaktujete někoho mimo tým?",
        scaleLabels: {
          1: "vždy nejdřív v rámci týmu",
          5: "většinou mimo tým (externisté, business, dodavatelé, Alena/Jakub)",
        },
      },
      {
        id: 11,
        type: "textarea",
        required: false,
        text: "Co vás nejvíc odrazuje od sdílení informací do týmové konverzace / distribučního listu?",
      },
      {
        id: 12,
        type: "checkbox",
        required: true,
        allowOther: true,
        text: "Jaký způsob sdílení informací by vám vyhovoval nejvíc? (lze více možností)",
        options: [
          "Krátký psaný update v chatu/kanálu",
          "Krátký ústní standup",
          "Sdílený dokument/nástroj (Confluence, Jira...)",
        ],
      },
      {
        id: 13,
        type: "radio",
        required: true,
        text: "Považujete týmový distribuční list / sdílený kanál za užitečný nástroj pro sdílení práce?",
        options: ["Ano", "Ne", "Nevím – nepoužívám ho"],
      },
    ],
  },
  {
    key: "C",
    title: "C. Projektová vs. operativní orientace",
    questions: [
      {
        id: 14,
        type: "scale5",
        required: true,
        text: "Vidíte se spíše jako člověk na dlouhodobé projekty, nebo na operativu/podporu?",
        scaleLabels: { 1: "čistě projekty", 5: "čistě operativa" },
      },
      {
        id: 15,
        type: "radio",
        required: true,
        text: "Kdybyste měli možnost věnovat se pouze projektové činnosti (žádná operativa), bylo by to pro vás zajímavější?",
        options: ["Ano", "Ne", "Je mi to jedno / nevím"],
      },
      {
        id: 16,
        type: "textarea",
        required: false,
        text: "Co vás na projektové, resp. operativní práci baví nejvíc?",
      },
      {
        id: 17,
        type: "radio",
        required: true,
        allowOther: true,
        text: "Byli byste ochotni věnovat víc času operativě, pokud by to tým potřeboval?",
        options: ["Ano", "Ne", "Záleží na okolnostech"],
      },
    ],
  },
  {
    key: "D",
    title: "D. Zájmy, rozvoj a potenciál",
    questions: [
      {
        id: 18,
        type: "textarea",
        required: false,
        text: "Je nějaká oblast, technologie nebo typ úkolů, kterým byste se rádi věnovali víc, ale zatím k tomu nemáte příležitost?",
      },
      {
        id: 19,
        type: "textarea",
        required: false,
        text: "Co by vám pomohlo se tomu začít věnovat (školení, mentoring, čas, zadání)?",
      },
      {
        id: 20,
        type: "textarea",
        required: false,
        text: "Vidíte v týmu nebo v naší práci prostor pro iniciativu/zlepšení, které aktuálně nikdo neřeší?",
      },
    ],
  },
  {
    key: "E",
    title: "E. Týmové statusy (2× týdně)",
    questions: [
      {
        id: 21,
        type: "scale5",
        required: true,
        text: "Jak užitečné jsou pro vás současné týmové statusy?",
        scaleLabels: { 1: "zbytečné", 5: "velmi užitečné" },
      },
      {
        id: 22,
        type: "radio",
        required: true,
        text: "Jste spíše pro zachování týmových statusů v současné podobě, nebo pro jejich zrušení či úpravu?",
        options: [
          "Zachovat beze změny",
          "Zachovat, ale změnit formu nebo frekvenci",
          "Zrušit",
          "Nevím",
        ],
      },
      {
        id: 23,
        type: "radio",
        required: true,
        allowOther: true,
        text: "Proč na statusech často nesdílíte žádný update?",
        options: [
          "Obvykle nemám co nového hlásit",
          "Nestihnu se připravit / nevím dopředu co říct",
          "Necítím potřebu informovat o své práci veřejně",
          "Nevím, co je pro tým relevantní sdílet",
        ],
      },
      {
        id: 24,
        type: "textarea",
        required: false,
        text: "Co by zvýšilo hodnotu/smysl statusů pro vás?",
      },
    ],
  },
  {
    key: "F",
    title: "F. Zpětná vazba na mě jako team leadera",
    questions: [
      {
        id: 25,
        type: "scale5",
        required: true,
        text: "Mám dostatečné odborné znalosti k tomu, abych vás mohl efektivně vést a pomáhat s technickými/procesními rozhodnutími.",
        scaleLabels: { 1: "vůbec nesouhlasím", 5: "plně souhlasím" },
      },
      {
        id: 26,
        type: "scale5",
        required: true,
        text: "Jasně komunikuji priority a očekávání.",
        scaleLabels: { 1: "vůbec nesouhlasím", 5: "plně souhlasím" },
      },
      {
        id: 27,
        type: "scale5",
        required: true,
        text: "Naslouchám vašim názorům a beru je v úvahu, než rozhodnu.",
        scaleLabels: { 1: "vůbec nesouhlasím", 5: "plně souhlasím" },
      },
      {
        id: 28,
        type: "scale5",
        required: true,
        text: "Moje rozhodnutí jsou v týmu respektována a dodržována, i když s nimi člen týmu úplně nesouhlasí.",
        scaleLabels: { 1: "vůbec nesouhlasím", 5: "plně souhlasím" },
      },
      {
        id: 29,
        type: "scale5",
        required: true,
        reverse: true,
        text: "Stává se, že se po mém rozhodnutí věci nakonec dělají jinak, „po svém“, bez toho, aby to se mnou bylo probráno.",
        scaleLabels: { 1: "nikdy", 5: "často" },
      },
      {
        id: 30,
        type: "textarea",
        required: false,
        text: "Co byste ode mě jako od leadera potřebovali víc?",
      },
      {
        id: 31,
        type: "textarea",
        required: false,
        text: "Co byste ode mě potřebovali méně / co vám naopak vadí?",
      },
      {
        id: 32,
        type: "textarea",
        required: false,
        text: "Co si na mém způsobu vedení týmu nejvíc ceníte?",
      },
      {
        id: 33,
        type: "textarea",
        required: false,
        text: "Je něco, co byste mi chtěli říct, ale dosud jste to neřekli?",
      },
    ],
  },
  {
    key: "G",
    title: "G. Nepovinná identifikace",
    intro:
      "Poslední krok. Jméno je zcela nepovinné – pokud ho vyplníte a odešlete formulář, už se nebudete moci vrátit a upravovat předchozí odpovědi.",
    questions: [
      {
        id: 34,
        type: "name",
        required: false,
        text: "Pokud chcete, můžete uvést své jméno (nepovinné):",
      },
    ],
  },
];
