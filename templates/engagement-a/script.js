/* ==========================================
موعد حفل الخطوبة

14 أكتوبر 2026
الساعة 4:00 عصرا
بتوقيت العراق +03:00
========================================== */

const engagementDate =
new Date(
  "2026-10-14T16:00:00+03:00"
).getTime();



/* ==========================================
العناصر
========================================== */

const bgMusic =
document.getElementById(
  "bgMusic"
);

const musicToggle =
document.getElementById(
  "musicToggle"
);

const musicIcon =
document.getElementById(
  "musicIcon"
);


/* زر الموسيقى بالكامل */

const musicControl =
document.querySelector(
  ".music-control"
);


const envelopeSection =
document.getElementById(
  "envelopeSection"
);

const envelopeElement =
document.getElementById(
  "envelopeElement"
);

const envelopeClickable =
document.getElementById(
  "envelopeClickable"
);

const inviteContent =
document.getElementById(
  "inviteContent"
);



/* ==========================================
الحالة
========================================== */

let invitationOpened = false;

let celebrationStarted = false;

let countdownInterval = null;



/* ==========================================
مستوى صوت الموسيقى
========================================== */

bgMusic.volume = 0.7;



/* ==========================================
تغيير أيقونة الصوت
========================================== */

function updateMusicIcon() {

  if (bgMusic.paused) {

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



/* ==========================================
تشغيل / إيقاف الموسيقى
========================================== */

function toggleAudio() {

  if (bgMusic.paused) {

    bgMusic
      .play()

      .then(() => {

        updateMusicIcon();

      })

      .catch(() => {

        console.log(
          "المتصفح ينتظر تفاعلا من المستخدم لتشغيل الصوت."
        );

      });

  } else {

    bgMusic.pause();

    updateMusicIcon();

  }

}



musicToggle.addEventListener(
  "click",
  toggleAudio
);



/* ==========================================
فتح الدعوة
========================================== */

function openInvitation() {

  if (invitationOpened) {
    return;
  }

  invitationOpened = true;



  /* ==========================================
     إظهار زر الموسيقى
     لا يظهر إلا بعد فتح الدعوة
  ========================================== */

  musicControl.classList.add(
    "visible"
  );



  /* فتح غطاء الظرف */

  envelopeElement.classList.add(
    "opened"
  );



  /* تشغيل الموسيقى */

  bgMusic
    .play()

    .then(() => {

      updateMusicIcon();

    })

    .catch(() => {

      console.log(
        "تعذر تشغيل الموسيقى تلقائيا."
      );

    });



  /* تفريحات بسيطة عند فتح الظرف */

  if (
    typeof confetti ===
    "function"
  ) {

    confetti({

      particleCount: 65,

      spread: 65,

      origin: {
        y: 0.62
      },

      colors: [

        "#c4974f",

        "#a85858",

        "#58674d",

        "#f5e9d3"

      ]

    });

  }



  /* بدء إخفاء الظرف */

  setTimeout(() => {

    envelopeSection.style.opacity =
      "0";

    envelopeSection.style.transform =
      "translateY(-20px)";

  }, 850);



  /* إظهار الدعوة */

  setTimeout(() => {

    envelopeSection.style.display =
      "none";

    inviteContent.style.display =
      "flex";


    requestAnimationFrame(() => {

      inviteContent.classList.add(
        "visible"
      );


      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    });

  }, 1500);

}



/* فتح عند الضغط */

envelopeClickable.addEventListener(
  "click",
  openInvitation
);



/* دعم لوحة المفاتيح */

envelopeClickable.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openInvitation();

    }

  }
);



/* ==========================================
تحديث العداد
========================================== */

function updateCountdown() {

  const now =
    new Date().getTime();

  const distance =
    engagementDate - now;



  /* وصل موعد الخطوبة */

  if (distance <= 0) {

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



    const message =
      document.getElementById(
        "countdownMessage"
      );


    message.textContent =
      "بدأت فرحتنا ♡";


    message.classList.add(
      "event-started"
    );



    if (
      !celebrationStarted
    ) {

      celebrationStarted = true;

      startMainCelebration();

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



  /* الأيام */

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



  /* الساعات */

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



  /* الدقائق */

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



  /* الثواني */

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
    String(days)
      .padStart(
        2,
        "0"
      );



  document.getElementById(
    "hours"
  ).textContent =
    String(hours)
      .padStart(
        2,
        "0"
      );



  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes)
      .padStart(
        2,
        "0"
      );



  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds)
      .padStart(
        2,
        "0"
      );

}



/* ==========================================
التفريحات عند موعد الحفل
========================================== */

function startMainCelebration() {

  if (
    typeof confetti !==
    "function"
  ) {

    return;

  }



  /* الدفعة الرئيسية */

  confetti({

    particleCount: 160,

    spread: 100,

    startVelocity: 45,

    origin: {

      x: 0.5,

      y: 0.65

    },

    colors: [

      "#c4974f",

      "#722026",

      "#58674d",

      "#f7e5bd",

      "#ffffff"

    ]

  });



  /* من اليمين */

  setTimeout(() => {

    confetti({

      particleCount: 100,

      angle: 135,

      spread: 75,

      origin: {

        x: 1,

        y: 0.55

      },

      colors: [

        "#c4974f",

        "#722026",

        "#58674d",

        "#f7e5bd"

      ]

    });

  }, 450);



  /* من اليسار */

  setTimeout(() => {

    confetti({

      particleCount: 100,

      angle: 45,

      spread: 75,

      origin: {

        x: 0,

        y: 0.55

      },

      colors: [

        "#c4974f",

        "#722026",

        "#58674d",

        "#f7e5bd"

      ]

    });

  }, 850);



  /* الدفعة الأخيرة */

  setTimeout(() => {

    confetti({

      particleCount: 180,

      spread: 130,

      gravity: 0.8,

      scalar: 1.05,

      origin: {

        x: 0.5,

        y: 0.45

      },

      colors: [

        "#c4974f",

        "#722026",

        "#58674d",

        "#f7e5bd",

        "#ffffff"

      ]

    });

  }, 1450);

}



/* ==========================================
تشغيل العداد
========================================== */

updateCountdown();

countdownInterval =
setInterval(

  updateCountdown,

  1000

);
