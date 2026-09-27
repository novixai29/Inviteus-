/* ==========================================
   UNDER THE STARS
   يوسف & زهراء

   موعد المناسبة:
   12 يناير 2027
   7:30 مساء
   توقيت العراق +03:00
========================================== */


/* ==========================================
   DATE
========================================== */

const engagementDate =
  new Date(
    "2027-01-12T19:30:00+03:00"
  ).getTime();



/* ==========================================
   ELEMENTS
========================================== */

const introOverlay =
  document.getElementById(
    "introOverlay"
  );

const introNames =
  document.getElementById(
    "introNames"
  );

const enterInvitationButton =
  document.getElementById(
    "enterInvitationButton"
  );

const starField =
  document.getElementById(
    "starField"
  );

const shootingStars =
  document.getElementById(
    "shootingStars"
  );

const shareButton =
  document.getElementById(
    "shareButton"
  );

const shareMessage =
  document.getElementById(
    "shareMessage"
  );

const calendarButton =
  document.getElementById(
    "calendarButton"
  );

const moonPhaseText =
  document.getElementById(
    "moonPhaseText"
  );

const daysRing =
  document.getElementById(
    "daysRing"
  );

const hoursRing =
  document.getElementById(
    "hoursRing"
  );

const minutesRing =
  document.getElementById(
    "minutesRing"
  );

const secondsRing =
  document.getElementById(
    "secondsRing"
  );



/* ==========================================
   INTRO
========================================== */

setTimeout(
  () => {
    introNames.classList.add(
      "active"
    );
  },
  700
);


enterInvitationButton.addEventListener(
  "click",
  () => {
    introOverlay.classList.add(
      "hidden"
    );
  }
);



/* ==========================================
   STARS
========================================== */

function createStars() {

  const starsCount =
    95;

  for (
    let i = 0;
    i < starsCount;
    i++
  ) {

    const star =
      document.createElement(
        "span"
      );

    star.className =
      "star";

    const size =
      1 +
      Math.random() * 3.2;

    star.style.width =
      `${size}px`;

    star.style.height =
      `${size}px`;

    star.style.left =
      `${Math.random() * 100}%`;

    star.style.top =
      `${Math.random() * 100}%`;

    star.style.animationDelay =
      `${Math.random() * 2.8}s, ${Math.random() * 1.4}s`;

    star.style.animationDuration =
      `${2 + Math.random() * 4}s, 1.4s`;

    starField.appendChild(
      star
    );

  }

}

createStars();



/* ==========================================
   SHOOTING STARS
========================================== */

function createShootingStar() {

  const star =
    document.createElement(
      "span"
    );

  star.className =
    "shooting-star";

  star.style.top =
    `${10 + Math.random() * 35}%`;

  star.style.right =
    `${-20 + Math.random() * 15}%`;

  shootingStars.appendChild(
    star
  );

  setTimeout(
    () => {
      star.remove();
    },
    1800
  );

}

setInterval(
  createShootingStar,
  3800
);



/* ==========================================
   MOUSE / TOUCH PARALLAX
========================================== */

function applyParallax(
  xRatio,
  yRatio
) {

  starField.style.transform =
    `translate(${xRatio * 10}px, ${yRatio * 10}px)`;

  document.querySelector(
    ".sky-glow"
  ).style.transform =
    `translate(${xRatio * 6}px, ${yRatio * 6}px)`;

}


window.addEventListener(
  "mousemove",
  event => {

    const xRatio =
      (
        event.clientX /
        window.innerWidth -
        0.5
      ) * -1;

    const yRatio =
      (
        event.clientY /
        window.innerHeight -
        0.5
      ) * -1;

    applyParallax(
      xRatio,
      yRatio
    );

  }
);


window.addEventListener(
  "deviceorientation",
  event => {

    if (
      event.gamma === null ||
      event.beta === null
    ) {
      return;
    }

    const xRatio =
      Math.max(
        -1,
        Math.min(1, event.gamma / 35)
      );

    const yRatio =
      Math.max(
        -1,
        Math.min(1, event.beta / 45)
      );

    applyParallax(
      xRatio,
      yRatio
    );

  }
);



/* ==========================================
   MOON PHASE
========================================== */

function calculateMoonPhaseLabel(
  targetDate
) {

  const knownNewMoon =
    new Date(
      "2000-01-06T18:14:00Z"
    );

  const synodicMonth =
    29.53058867;

  const dayMs =
    1000 * 60 * 60 * 24;

  const daysSince =
    (
      targetDate - knownNewMoon
    ) / dayMs;

  let phase =
    daysSince % synodicMonth;

  if (
    phase < 0
  ) {
    phase += synodicMonth;
  }

  if (phase < 1.84566)
    return "🌑 محاق";
  if (phase < 5.53699)
    return "🌒 هلال متزايد";
  if (phase < 9.22831)
    return "🌓 تربيع أول";
  if (phase < 12.91963)
    return "🌔 أحدب متزايد";
  if (phase < 16.61096)
    return "🌕 بدر";
  if (phase < 20.30228)
    return "🌖 أحدب متناقص";
  if (phase < 23.99361)
    return "🌗 تربيع أخير";

  return "🌘 هلال متناقص";

}

moonPhaseText.textContent =
  calculateMoonPhaseLabel(
    new Date(
      "2027-01-12T19:30:00+03:00"
    )
  );



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

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -35px 0px"
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

function setRingProgress(
  ringElement,
  current,
  max
) {

  const ratio =
    Math.max(
      0,
      Math.min(1, current / max)
    );

  const degrees =
    ratio * 360;

  ringElement.style.setProperty(
    "--progress",
    `${degrees}deg`
  );

}


function updateCountdown() {

  const now =
    Date.now();

  const distance =
    engagementDate - now;

  if (
    distance <= 0
  ) {

    document.getElementById(
      "days"
    ).textContent = "00";

    document.getElementById(
      "hours"
    ).textContent = "00";

    document.getElementById(
      "minutes"
    ).textContent = "00";

    document.getElementById(
      "seconds"
    ).textContent = "00";

    document.getElementById(
      "countdownMessage"
    ).textContent =
      "بدأت ليلتنا ✨";

    setRingProgress(
      daysRing,
      1,
      1
    );
    setRingProgress(
      hoursRing,
      1,
      1
    );
    setRingProgress(
      minutesRing,
      1,
      1
    );
    setRingProgress(
      secondsRing,
      1,
      1
    );

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
      ) /
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
      ) /
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
      ) / 1000
    );

  document.getElementById(
    "days"
  ).textContent =
    String(days).padStart(2, "0");

  document.getElementById(
    "hours"
  ).textContent =
    String(hours).padStart(2, "0");

  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes).padStart(2, "0");

  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds).padStart(2, "0");


  const totalDays =
    Math.ceil(
      (
        engagementDate -
        new Date(
          "2026-09-26T00:00:00+03:00"
        ).getTime()
      ) /
      (
        1000 *
        60 *
        60 *
        24
      )
    );

  setRingProgress(
    daysRing,
    totalDays - days,
    totalDays || 1
  );

  setRingProgress(
    hoursRing,
    hours,
    24
  );

  setRingProgress(
    minutesRing,
    minutes,
    60
  );

  setRingProgress(
    secondsRing,
    seconds,
    60
  );

}

updateCountdown();
setInterval(
  updateCountdown,
  1000
);



/* ==========================================
   ADD TO CALENDAR
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
      "2027-01-12T19:30:00+03:00"
    );

  const end =
    new Date(
      "2027-01-12T22:30:00+03:00"
    );

  const content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Under The Stars//AR
BEGIN:VEVENT
UID:${Date.now()}@underthestars
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:حفل خطوبة يوسف وزهراء
LOCATION:قاعة النجمة - الموصل - نينوى
DESCRIPTION:ندعوكم لمشاركتنا ليلة مميزة تحت النجوم.
END:VEVENT
END:VCALENDAR`;

  const blob =
    new Blob(
      [content],
      {
        type: "text/calendar;charset=utf-8"
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

  link.href = url;
  link.download =
    "yousif-zahraa-under-the-stars.ics";

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
      "Under The Stars — يوسف وزهراء",

    text:
      "ندعوكم لمشاركتنا ليلة مميزة تحت النجوم.",

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

    await navigator.clipboard.writeText(
      window.location.href
    );

    shareMessage.textContent =
      "تم نسخ رابط الدعوة";

    setTimeout(
      () => {
        shareMessage.textContent = "";
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



/* ==========================================
   TILT CARDS
========================================== */

const tiltCards =
  document.querySelectorAll(
    ".tilt-card"
  );

tiltCards.forEach(
  card => {

    card.addEventListener(
      "mousemove",
      event => {

        const rect =
          card.getBoundingClientRect();

        const x =
          (
            (event.clientX - rect.left) /
            rect.width
          ) - 0.5;

        const y =
          (
            (event.clientY - rect.top) /
            rect.height
          ) - 0.5;

        card.style.transform =
          `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-2px)`;

      }
    );

    card.addEventListener(
      "mouseleave",
      () => {
        card.style.transform =
          "perspective(800px) rotateY(0deg) rotateX(0deg)";
      }
    );

  }
);
