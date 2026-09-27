/* ==========================================
   موعد حفل الخطوبة

   علي & زهراء

   14 أكتوبر 2026
   الساعة 4:00 عصرا
   توقيت العراق +03:00
========================================== */

const engagementDate =
  new Date(
    "2026-10-14T16:00:00+03:00"
  ).getTime();



/* ==========================================
   العناصر
========================================== */

const curtainScreen =
  document.getElementById(
    "curtainScreen"
  );


const openInvitationButton =
  document.getElementById(
    "openInvitationButton"
  );


const inviteContent =
  document.getElementById(
    "inviteContent"
  );


const bgMusic =
  document.getElementById(
    "bgMusic"
  );


const musicControl =
  document.getElementById(
    "musicControl"
  );


const musicToggle =
  document.getElementById(
    "musicToggle"
  );


const musicIcon =
  document.getElementById(
    "musicIcon"
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


const goldParticles =
  document.getElementById(
    "goldParticles"
  );



/* ==========================================
   الحالة
========================================== */

let invitationOpened =
  false;


let countdownInterval =
  null;


let celebrationStarted =
  false;



/* ==========================================
   الموسيقى
========================================== */

bgMusic.volume =
  0.65;



function updateMusicIcon() {

  if (
    bgMusic.paused
  ) {

    musicIcon.classList.remove(
      "fa-volume-high"
    );


    musicIcon.classList.add(
      "fa-volume-xmark"
    );

  } else {

    musicIcon.classList.remove(
      "fa-volume-xmark"
    );


    musicIcon.classList.add(
      "fa-volume-high"
    );

  }

}



async function toggleMusic() {

  if (
    bgMusic.paused
  ) {

    try {

      await bgMusic.play();


      updateMusicIcon();

    } catch (error) {

      console.log(
        "تعذر تشغيل الموسيقى."
      );

    }

  } else {

    bgMusic.pause();


    updateMusicIcon();

  }

}



musicToggle.addEventListener(
  "click",
  toggleMusic
);



/* ==========================================
   فتح الستارة
========================================== */

async function openInvitation() {

  if (
    invitationOpened
  ) {

    return;

  }


  invitationOpened =
    true;


  curtainScreen.classList.add(
    "opened"
  );


  musicControl.classList.add(
    "visible"
  );


  try {

    await bgMusic.play();


    updateMusicIcon();

  } catch (error) {

    console.log(
      "المتصفح منع التشغيل التلقائي للصوت."
    );

  }



  /* تفريحات ذهبية */

  if (
    typeof confetti ===
    "function"
  ) {

    confetti({

      particleCount:
        70,

      spread:
        70,

      startVelocity:
        28,

      origin: {

        x:
          0.5,

        y:
          0.56

      },

      colors: [

        "#d7b46a",

        "#f1d99e",

        "#947039",

        "#f7f0df"

      ]

    });

  }



  setTimeout(
    () => {

      curtainScreen.style.visibility =
        "hidden";


      curtainScreen.style.pointerEvents =
        "none";


      inviteContent.classList.add(
        "visible"
      );


      window.scrollTo({

        top:
          0,

        behavior:
          "instant"

      });

    },
    1750
  );

}



openInvitationButton.addEventListener(
  "click",
  openInvitation
);



/* ==========================================
   إنشاء الذرات الذهبية
========================================== */

function createGoldParticles() {

  const particleCount =
    32;


  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const particle =
      document.createElement(
        "span"
      );


    particle.className =
      "gold-particle";


    const size =
      Math.random() *
      3 +
      1;


    particle.style.width =
      `${size}px`;


    particle.style.height =
      `${size}px`;


    particle.style.left =
      `${Math.random() * 100}%`;


    particle.style.animationDuration =
      `${
        11 +
        Math.random() *
        15
      }s`;


    particle.style.animationDelay =
      `${
        Math.random() *
        12
      }s`;


    particle.style.opacity =
      Math.random() *
      0.7;


    goldParticles.appendChild(
      particle
    );

  }

}



createGoldParticles();



/* ==========================================
   العداد التنازلي
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



    const countdownMessage =
      document.getElementById(
        "countdownMessage"
      );


    countdownMessage.textContent =
      "حان موعد فرحتنا ♡";



    if (
      !celebrationStarted
    ) {

      celebrationStarted =
        true;


      startCelebration();

    }



    if (
      countdownInterval
    ) {

      clearInterval(
        countdownInterval
      );

    }


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
      2,
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



countdownInterval =
  setInterval(
    updateCountdown,
    1000
  );



/* ==========================================
   الاحتفال عند وصول الموعد
========================================== */

function startCelebration() {

  if (
    typeof confetti !==
    "function"
  ) {

    return;

  }



  const colors = [

    "#d7b46a",

    "#f1d99e",

    "#947039",

    "#f7f0df"

  ];



  confetti({

    particleCount:
      160,

    spread:
      110,

    startVelocity:
      40,

    origin: {

      x:
        0.5,

      y:
        0.6

    },

    colors

  });



  setTimeout(
    () => {

      confetti({

        particleCount:
          90,

        angle:
          60,

        spread:
          70,

        origin: {

          x:
            0,

          y:
            0.6

        },

        colors

      });

    },
    400
  );



  setTimeout(
    () => {

      confetti({

        particleCount:
          90,

        angle:
          120,

        spread:
          70,

        origin: {

          x:
            1,

          y:
            0.6

        },

        colors

      });

    },
    750
  );

}



/* ==========================================
   تحويل التاريخ لتقويم ICS
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
   إضافة الموعد إلى التقويم
========================================== */

function addToCalendar() {

  const startDate =
    new Date(
      "2026-10-14T16:00:00+03:00"
    );


  const endDate =
    new Date(
      "2026-10-14T19:00:00+03:00"
    );


  const title =
    "حفل خطوبة علي وزهراء";


  const location =
    "قاعة القمة - الموصل - نينوى";


  const description =
    "نتشرف بحضوركم ومشاركتكم فرحتنا بحفل الخطوبة.";



  const icsContent =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Royal Engagement Invitation//AR
BEGIN:VEVENT
UID:${Date.now()}@invite
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;



  const blob =
    new Blob(
      [icsContent],
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
    "ali-zahraa-engagement.ics";



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
   مشاركة الدعوة
========================================== */

async function shareInvitation() {

  const shareData = {

    title:
      "دعوة حفل خطوبة علي وزهراء",

    text:
      "يسعدنا دعوتكم لمشاركتنا فرحة حفل خطوبتنا.",

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
