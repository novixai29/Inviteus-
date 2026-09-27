/* ==========================================
   BOARDING PASS — رحلة العمر

   مروان & زينة

   7 أغسطس 2027
   5:00 مساء
========================================== */


/* ==========================================
   EVENT
========================================== */

const EVENT = {

  start:
    "2027-08-07T17:00:00+03:00",

  end:
    "2027-08-07T20:00:00+03:00",

  title:
    "حفل خطوبة مروان وزينة",

  venue:
    "قاعة سكاي لاين - الموصل - نينوى",

  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Skyline+Hall+Mosul"

};


const engagementDate =
  new Date(
    EVENT.start
  ).getTime();



/* ==========================================
   ELEMENTS
========================================== */

const introScreen =
  document.getElementById(
    "introScreen"
  );


const enterButton =
  document.getElementById(
    "enterButton"
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
   INTRO
========================================== */

enterButton.addEventListener(
  "click",
  () => {

    introScreen.classList.add(
      "hidden"
    );

  }
);



/* ==========================================
   QR CODE
========================================== */

const qrContainer =
  document.getElementById(
    "ticketQr"
  );


if (
  typeof QRCode !==
  "undefined"
) {

  new QRCode(
    qrContainer,
    {

      text:
        EVENT.mapUrl,

      width:
        125,

      height:
        125,

      colorDark:
        "#151515",

      colorLight:
        "#ffffff",

      correctLevel:
        QRCode.CorrectLevel.H

    }
  );

}



/* ==========================================
   REVEAL
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

      threshold:
        0.14,

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
   COUNTDOWN
========================================== */

function updateCountdown() {

  const now =
    Date.now();


  const distance =
    engagementDate -
    now;



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


    document.getElementById(
      "countdownMessage"
    ).textContent =
      "حان وقت الإقلاع ✈️";


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
   ICS
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
PRODID:-//Boarding Pass Engagement//AR
BEGIN:VEVENT
UID:${Date.now()}@boardingpass
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${EVENT.title}
LOCATION:${EVENT.venue}
DESCRIPTION:رحلة العمر — مروان وزينة.
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
    "marwan-zeina-boarding-pass.ics";


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
      "رحلة العمر — مروان وزينة",

    text:
      "بطاقة صعود رحلة العمر لمروان وزينة ✈️",

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
      "تم نسخ رابط بطاقة الصعود";


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
