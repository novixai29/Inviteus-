/* ==========================================
   MINIMAL LUXURY

   رامي & لينا

   LANGUAGE:
   Manual only

   DEFAULT THEME:
   Dark
========================================== */


/* ==========================================
   EVENT DATA
========================================== */

const EVENT = {

  start:
    "2027-05-14T18:30:00+03:00",

  end:
    "2027-05-14T21:30:00+03:00",

  titleAR:
    "حفل خطوبة رامي ولينا",

  titleEN:
    "Rami & Lina Engagement",

  venueAR:
    "قاعة إليت - الموصل - نينوى",

  venueEN:
    "Elite Hall - Mosul - Nineveh"

};



const engagementDate =
  new Date(
    EVENT.start
  ).getTime();



/* ==========================================
   ELEMENTS
========================================== */

const body =
  document.body;


const languageButton =
  document.getElementById(
    "languageButton"
  );


const languageButtonText =
  document.getElementById(
    "languageButtonText"
  );


const themeButton =
  document.getElementById(
    "themeButton"
  );


const themeIcon =
  document.getElementById(
    "themeIcon"
  );


const calendarButton =
  document.getElementById(
    "calendarButton"
  );


const shareButton =
  document.getElementById(
    "shareButton"
  );


const shareMessage =
  document.getElementById(
    "shareMessage"
  );


const cursorGlow =
  document.getElementById(
    "cursorGlow"
  );


const header =
  document.querySelector(
    ".top-header"
  );


const themeColorMeta =
  document.querySelector(
    'meta[name="theme-color"]'
  );



/* ==========================================
   LANGUAGE
   MANUAL ONLY
========================================== */

let currentLanguage =
  "ar";



function setLanguage(
  language
) {

  currentLanguage =
    language;


  const translatableElements =
    document.querySelectorAll(
      "[data-ar][data-en]"
    );


  translatableElements.forEach(
    element => {

      const text =
        language === "ar"

          ? element.getAttribute(
              "data-ar"
            )

          : element.getAttribute(
              "data-en"
            );


      element.textContent =
        text;

    }
  );



  /* Arabic */

  if (
    language === "ar"
  ) {

    document.documentElement.lang =
      "ar";


    document.documentElement.dir =
      "rtl";


    body.classList.remove(
      "en"
    );


    body.classList.add(
      "ar"
    );


    /*
      لأن الصفحة حالياً عربي
      نعرض EN حتى يقدر يحول للإنكليزي
    */

    languageButtonText.textContent =
      "EN";


    return;

  }



  /* English */

  document.documentElement.lang =
    "en";


  document.documentElement.dir =
    "ltr";


  body.classList.remove(
    "ar"
  );


  body.classList.add(
    "en"
  );


  /*
    لأن الصفحة حالياً English
    نعرض AR حتى يقدر يرجع للعربي
  */

  languageButtonText.textContent =
    "AR";

}



/* زر اللغة */

languageButton.addEventListener(
  "click",
  () => {

    if (
      currentLanguage === "ar"
    ) {

      setLanguage(
        "en"
      );

    } else {

      setLanguage(
        "ar"
      );

    }

  }
);



/*
   يبدأ الموقع دائماً بالعربي.

   لا يوجد:
   setInterval
   languageTimer
   auto language switching
*/

setLanguage(
  "ar"
);



/* ==========================================
   THEME
========================================== */

function setTheme(
  theme
) {

  if (
    theme === "dark"
  ) {

    body.classList.add(
      "dark-mode"
    );


    themeIcon.className =
      "fa-regular fa-sun";


    themeColorMeta.setAttribute(
      "content",
      "#090909"
    );


    return;

  }



  body.classList.remove(
    "dark-mode"
  );


  themeIcon.className =
    "fa-regular fa-moon";


  themeColorMeta.setAttribute(
    "content",
    "#f4f3ef"
  );

}



/*
   مهم:
   في كل مرة تنفتح الدعوة
   يبدأ الموقع DARK.
*/

setTheme(
  "dark"
);



/* زر الوضع */

themeButton.addEventListener(
  "click",
  () => {

    const currentlyDark =
      body.classList.contains(
        "dark-mode"
      );


    if (
      currentlyDark
    ) {

      setTheme(
        "light"
      );

    } else {

      setTheme(
        "dark"
      );

    }

  }
);



/* ==========================================
   CURSOR GLOW
========================================== */

window.addEventListener(
  "mousemove",
  event => {

    if (
      !cursorGlow
    ) {

      return;

    }


    cursorGlow.style.left =
      `${event.clientX}px`;


    cursorGlow.style.top =
      `${event.clientY}px`;

  }
);



/* ==========================================
   HEADER SCROLL
========================================== */

function updateHeader() {

  if (
    window.scrollY >
    25
  ) {

    header.classList.add(
      "scrolled"
    );

  } else {

    header.classList.remove(
      "scrolled"
    );

  }

}



window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);


updateHeader();



/* ==========================================
   TYPOGRAPHY PARALLAX
========================================== */

const parallaxElements =
  document.querySelectorAll(
    ".parallax-text"
  );


let parallaxTicking =
  false;



function updateParallax() {

  parallaxElements.forEach(
    element => {

      const parent =
        element.parentElement;


      const rect =
        parent.getBoundingClientRect();


      const speed =
        Number(
          element.dataset.speed
        ) || 0.05;


      const center =
        rect.top +
        rect.height / 2;


      const viewportCenter =
        window.innerHeight / 2;


      const distance =
        center -
        viewportCenter;


      const offset =
        distance *
        speed;


      element.style.marginTop =
        `${offset}px`;

    }
  );


  parallaxTicking =
    false;

}



window.addEventListener(
  "scroll",
  () => {

    if (
      parallaxTicking
    ) {

      return;

    }


    parallaxTicking =
      true;


    requestAnimationFrame(
      updateParallax
    );

  },
  {
    passive: true
  }
);


updateParallax();



/* ==========================================
   PHOTO PARALLAX
========================================== */

const heroImage =
  document.querySelector(
    ".hero-background-image"
  );


const heroSection =
  document.querySelector(
    ".hero-section"
  );


const storyImage =
  document.querySelector(
    ".story-background-image"
  );


const storySection =
  document.querySelector(
    ".cinematic-story-section"
  );



function updatePhotoParallax() {


  /* HERO */

  if (
    heroImage &&
    heroSection
  ) {

    const heroRect =
      heroSection
        .getBoundingClientRect();


    if (
      heroRect.bottom >
      0
      &&
      heroRect.top <
      window.innerHeight
    ) {

      const heroOffset =
        heroRect.top *
        -0.045;


      heroImage.style.transform =
        `scale(1.06) translateY(${heroOffset}px)`;

    }

  }



  /* SECOND PHOTO */

  if (
    storyImage &&
    storySection
  ) {

    const storyRect =
      storySection
        .getBoundingClientRect();


    if (
      storyRect.bottom >
      0
      &&
      storyRect.top <
      window.innerHeight
    ) {

      const storyOffset =
        storyRect.top *
        -0.04;


      storyImage.style.transform =
        `scale(1.08) translateY(${storyOffset}px)`;

    }

  }

}



window.addEventListener(
  "scroll",
  updatePhotoParallax,
  {
    passive: true
  }
);


updatePhotoParallax();



/* ==========================================
   REVEAL ON SCROLL
========================================== */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add(
                "visible"
              );


            revealObserver
              .unobserve(
                entry.target
              );

          }

        }
      );

    },
    {

      threshold:
        0.13,

      rootMargin:
        "0px 0px -35px 0px"

    }
  );



revealElements.forEach(
  element => {

    revealObserver.observe(
      element
    );

  }
);



/* ==========================================
   COUNTDOWN
========================================== */

function updateCountdown() {

  const now =
    Date.now();


  const distance =
    engagementDate -
    now;



  /* انتهى العداد */

  if (
    distance <=
    0
  ) {

    document.getElementById(
      "days"
    ).textContent =
      "000";


    document.getElementById(
      "hours"
    ).textContent =
      "00";


    document.getElementById(
      "minutes"
    ).textContent =
      "00";


    document.getElementById(
      "seconds"
    ).textContent =
      "00";


    const message =
      document.getElementById(
        "countdownMessage"
      );


    /*
      هنا ما نستخدم data-ar/data-en
      لأن المناسبة بدأت.
    */

    message.textContent =
      currentLanguage === "ar"

        ? "حان موعدنا"

        : "THE DAY IS HERE";


    return;

  }



  const days =
    Math.floor(
      distance /
      (
        1000 *
        60 *
        60 *
        24
      )
    );



  const hours =
    Math.floor(
      (
        distance %
        (
          1000 *
          60 *
          60 *
          24
        )
      )
      /
      (
        1000 *
        60 *
        60
      )
    );



  const minutes =
    Math.floor(
      (
        distance %
        (
          1000 *
          60 *
          60
        )
      )
      /
      (
        1000 *
        60
      )
    );



  const seconds =
    Math.floor(
      (
        distance %
        (
          1000 *
          60
        )
      )
      /
      1000
    );



  document.getElementById(
    "days"
  ).textContent =
    String(
      days
    ).padStart(
      3,
      "0"
    );



  document.getElementById(
    "hours"
  ).textContent =
    String(
      hours
    ).padStart(
      2,
      "0"
    );



  document.getElementById(
    "minutes"
  ).textContent =
    String(
      minutes
    ).padStart(
      2,
      "0"
    );



  document.getElementById(
    "seconds"
  ).textContent =
    String(
      seconds
    ).padStart(
      2,
      "0"
    );

}



updateCountdown();



setInterval(
  updateCountdown,
  1000
);



/* ==========================================
   ICS FORMAT
========================================== */

function formatICSDate(
  date
) {

  return date
    .toISOString()
    .replace(
      /[-:]/g,
      ""
    )
    .replace(
      /\.\d{3}/,
      ""
    );

}



/* ==========================================
   ADD TO CALENDAR
========================================== */

function addToCalendar() {

  const start =
    new Date(
      EVENT.start
    );


  const end =
    new Date(
      EVENT.end
    );


  const content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Minimal Luxury Engagement//AR
BEGIN:VEVENT
UID:${Date.now()}@minimalengagement
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${EVENT.titleAR}
LOCATION:${EVENT.venueAR}
DESCRIPTION:ندعوكم لمشاركتنا بداية فصل جديد من حياتنا.
END:VEVENT
END:VCALENDAR`;


  const blob =
    new Blob(
      [content],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    "rami-lina-engagement.ics";


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );

}



calendarButton.addEventListener(
  "click",
  addToCalendar
);



/* ==========================================
   SHARE
========================================== */

async function shareInvitation() {

  const shareData = {

    title:
      currentLanguage === "ar"

        ? EVENT.titleAR

        : EVENT.titleEN,


    text:
      currentLanguage === "ar"

        ? "ندعوكم لمشاركتنا بداية فصل جديد من حياتنا."

        : "We invite you to share the beginning of our new chapter.",


    url:
      window.location.href

  };



  if (
    navigator.share
  ) {

    try {

      await navigator.share(
        shareData
      );

    } catch (error) {

      console.log(
        "Share cancelled"
      );

    }


    return;

  }



  try {

    await navigator
      .clipboard
      .writeText(
        window.location.href
      );


    shareMessage.textContent =
      currentLanguage === "ar"

        ? "تم نسخ رابط الدعوة"

        : "Invitation link copied";


    setTimeout(
      () => {

        shareMessage.textContent =
          "";

      },
      2500
    );

  } catch (error) {

    shareMessage.textContent =
      currentLanguage === "ar"

        ? "تعذر نسخ الرابط"

        : "Unable to copy link";

  }

}
	


shareButton.addEventListener(
  "click",
  shareInvitation
);
