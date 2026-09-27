/* ==========================================
   BOTANICAL GARDEN

   سيف & جنى

   22 أبريل 2027
   الساعة 6:00 مساء
========================================== */


/* ==========================================
   EVENT DATE
========================================== */

const engagementDate =
  new Date(
    "2027-04-22T18:00:00+03:00"
  ).getTime();



/* ==========================================
   ELEMENTS
========================================== */

const gardenIntro =
  document.getElementById(
    "gardenIntro"
  );


const openGardenButton =
  document.getElementById(
    "openGardenButton"
  );


const floatingLeaves =
  document.getElementById(
    "floatingLeaves"
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



/* ==========================================
   OPEN GARDEN GATE
========================================== */

openGardenButton.addEventListener(
  "click",
  () => {

    gardenIntro.classList.add(
      "open"
    );


    openGardenButton.style.opacity =
      "0";


    openGardenButton.style.pointerEvents =
      "none";


    setTimeout(
      () => {

        gardenIntro.classList.add(
          "hidden"
        );

      },
      1500
    );

  }
);



/* ==========================================
   FLOATING LEAVES
========================================== */

function createLeaf() {

  const leaf =
    document.createElement(
      "span"
    );


  leaf.className =
    "floating-leaf";


  const size =
    8 +
    Math.random() * 12;


  leaf.style.width =
    `${size}px`;


  leaf.style.height =
    `${size * 1.8}px`;


  leaf.style.left =
    `${Math.random() * 100}%`;


  leaf.style.animationDuration =
    `${6 + Math.random() * 6}s`;


  leaf.style.opacity =
    0.25 +
    Math.random() * 0.45;


  leaf.style.background =
    Math.random() > 0.5

      ? "rgba(111,122,81,.45)"

      : "rgba(150,162,118,.42)";


  floatingLeaves.appendChild(
    leaf
  );


  setTimeout(
    () => {

      leaf.remove();

    },
    12500
  );

}



setInterval(
  createLeaf,
  1300
);



/* ==========================================
   SCROLL LEAF PARALLAX
========================================== */

window.addEventListener(
  "scroll",
  () => {

    const scrollY =
      window.scrollY;


    const butterflies =
      document.querySelector(
        ".butterflies"
      );


    butterflies.style.transform =
      `translateY(${scrollY * 0.025}px)`;

  }
);



/* ==========================================
   REVEAL
========================================== */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );


            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {

      threshold: 0.14,

      rootMargin:
        "0px 0px -35px 0px"

    }
  );


revealElements.forEach(
  element => {

    observer.observe(
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


  if (
    distance <= 0
  ) {

    document.getElementById(
      "days"
    ).textContent =
      "00";


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


    document.getElementById(
      "countdownMessage"
    ).textContent =
      "أزهرت ليلتنا 🌿";


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
    String(days).padStart(
      2,
      "0"
    );


  document.getElementById(
    "hours"
  ).textContent =
    String(hours).padStart(
      2,
      "0"
    );


  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes).padStart(
      2,
      "0"
    );


  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds).padStart(
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
   CALENDAR
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



function addToCalendar() {

  const start =
    new Date(
      "2027-04-22T18:00:00+03:00"
    );


  const end =
    new Date(
      "2027-04-22T21:00:00+03:00"
    );


  const content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Botanical Garden Engagement//AR
BEGIN:VEVENT
UID:${Date.now()}@botanicalgarden
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:حفل خطوبة سيف وجنى
LOCATION:قاعة البستان - الموصل - نينوى
DESCRIPTION:ندعوكم لمشاركتنا بداية جميلة بين الورد والفرح.
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
    "saif-jana-engagement.ics";


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
      "سيف وجنى — Botanical Garden",

    text:
      "ندعوكم لمشاركتنا بداية جميلة بين الورد والفرح.",

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
        "تم إلغاء المشاركة."
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
      "تم نسخ رابط الدعوة";


    setTimeout(
      () => {

        shareMessage.textContent =
          "";

      },
      2500
    );

  } catch (error) {

    shareMessage.textContent =
      "تعذر نسخ الرابط";

  }

}



shareButton.addEventListener(
  "click",
  shareInvitation
);
