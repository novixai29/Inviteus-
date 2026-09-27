/* ==========================================
   OUR ENGAGEMENT MOVIE

   كريم & نور

   19 ديسمبر 2026
   الساعة 7:00 مساء
   توقيت العراق +03:00
========================================== */


/* ==========================================
   موعد الخطوبة
========================================== */

const engagementDate =
  new Date(
    "2026-12-19T19:00:00+03:00"
  ).getTime();



/* ==========================================
   العناصر
========================================== */

const cinemaIntro =
  document.getElementById(
    "cinemaIntro"
  );


const introSteps =
  document.querySelectorAll(
    ".intro-step"
  );


const enterMovieButton =
  document.getElementById(
    "enterMovieButton"
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



/* ==========================================
   الحالة
========================================== */

let movieStarted =
  false;


let currentIntroStep =
  0;


let introTimer =
  null;


let countdownInterval =
  null;



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
   المقدمة السينمائية
========================================== */

function showIntroStep(
  index
) {

  introSteps.forEach(
    step => {

      step.classList.remove(
        "active"
      );

    }
  );


  if (
    introSteps[index]
  ) {

    introSteps[index]
      .classList
      .add(
        "active"
      );

  }

}



function runIntroSequence() {

  currentIntroStep =
    0;


  showIntroStep(
    currentIntroStep
  );


  introTimer =
    setInterval(
      () => {

        currentIntroStep++;


        if (
          currentIntroStep >=
          introSteps.length
        ) {

          clearInterval(
            introTimer
          );


          enterMovieButton
            .classList
            .add(
              "visible"
            );


          return;

        }


        showIntroStep(
          currentIntroStep
        );

      },
      2200
    );

}



runIntroSequence();



/* ==========================================
   دخول الدعوة
========================================== */

async function startMovie() {

  if (
    movieStarted
  ) {

    return;

  }


  movieStarted =
    true;


  cinemaIntro
    .classList
    .add(
      "hidden"
    );


  musicControl
    .classList
    .add(
      "visible"
    );


  try {

    await bgMusic.play();


    updateMusicIcon();

  } catch (error) {

    console.log(
      "المتصفح منع تشغيل الموسيقى تلقائيا."
    );

  }


  setTimeout(
    () => {

      window.scrollTo({

        top:
          0,

        behavior:
          "instant"

      });

    },
    400
  );

}



enterMovieButton
  .addEventListener(
    "click",
    startMovie
  );



/* ==========================================
   ظهور العناصر أثناء Scroll
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
        0.15,

      rootMargin:
        "0px 0px -30px 0px"

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


    document.getElementById(
      "countdownMessage"
    ).textContent =
      "بدأ العرض ♡";


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
   تنسيق ICS
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
   إضافة الموعد للتقويم
========================================== */

function addToCalendar() {

  const start =
    new Date(
      "2026-12-19T19:00:00+03:00"
    );


  const end =
    new Date(
      "2026-12-19T22:00:00+03:00"
    );


  const content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Our Engagement Movie//AR
BEGIN:VEVENT
UID:${Date.now()}@engagementmovie
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:حفل خطوبة كريم ونور
LOCATION:قاعة لافندر - الموصل - نينوى
DESCRIPTION:ندعوكم لمشاركتنا العرض الأول لأجمل فصول حكايتنا.
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
    "karim-noor-engagement.ics";


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



calendarButton
  .addEventListener(
    "click",
    addToCalendar
  );



/* ==========================================
   مشاركة الدعوة
========================================== */

async function shareInvitation() {

  const shareData = {

    title:
      "Our Engagement Movie — كريم ونور",

    text:
      "ندعوكم لمشاركتنا العرض الأول لأجمل فصول حكايتنا.",

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



shareButton
  .addEventListener(
    "click",
    shareInvitation
  );
