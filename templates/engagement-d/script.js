/* ==========================================
   ENGAGEMENT NEWSPAPER

   عمر & ليان

   السبت 5 ديسمبر 2026
   الساعة 6:30 مساء
   توقيت العراق +03:00
========================================== */


/* ==========================================
   البيانات الرئيسية
========================================== */

const EVENT = {

  groom:
    "عمر",

  bride:
    "ليان",

  title:
    "حفل خطوبة عمر وليان",

  start:
    "2026-12-05T18:30:00+03:00",

  end:
    "2026-12-05T21:30:00+03:00",

  venue:
    "قاعة رويال",

  city:
    "الموصل - نينوى",

  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Royal+Hall+Mosul"

};



/* ==========================================
   العناصر
========================================== */

const newspaperIntro =
  document.getElementById(
    "newspaperIntro"
  );


const newspaperCover =
  document.getElementById(
    "newspaperCover"
  );


const openPaperButton =
  document.getElementById(
    "openPaperButton"
  );


const calendarButton =
  document.getElementById(
    "calendarButton"
  );


const downloadCardButton =
  document.getElementById(
    "downloadCardButton"
  );


const downloadCard =
  document.getElementById(
    "downloadCard"
  );


const mapLink =
  document.getElementById(
    "mapLink"
  );



/* ==========================================
   حالة فتح الجريدة
========================================== */

let newspaperOpened =
  false;



/* ==========================================
   فتح الجريدة
========================================== */

function openNewspaper() {

  if (
    newspaperOpened
  ) {

    return;

  }


  newspaperOpened =
    true;


  newspaperCover.classList.add(
    "page-turn"
  );


  openPaperButton.style.opacity =
    "0";


  openPaperButton.style.pointerEvents =
    "none";


  setTimeout(
    () => {

      newspaperIntro.classList.add(
        "hidden"
      );


      window.scrollTo({

        top:
          0,

        behavior:
          "instant"

      });

    },
    1200
  );

}



openPaperButton.addEventListener(
  "click",
  openNewspaper
);



/* ==========================================
   QR CODE
========================================== */

function createQRCode() {

  const qrElement =
    document.getElementById(
      "qrcode"
    );


  if (
    !qrElement ||
    typeof QRCode ===
    "undefined"
  ) {

    return;

  }


  qrElement.innerHTML =
    "";


  new QRCode(
    qrElement,
    {

      text:
        EVENT.mapUrl,

      width:
        140,

      height:
        140,

      colorDark:
        "#24211c",

      colorLight:
        "#ffffff",

      correctLevel:
        QRCode.CorrectLevel.H

    }
  );

}



createQRCode();



/* ==========================================
   تنسيق تاريخ ICS
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
   تنظيف النص لـ ICS
========================================== */

function escapeICS(
  value
) {

  return String(
    value
  )
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /,/g,
      "\\,"
    )
    .replace(
      /;/g,
      "\\;"
    )
    .replace(
      /\n/g,
      "\\n"
    );

}



/* ==========================================
   إضافة الموعد إلى التقويم
========================================== */

function addToCalendar() {

  const startDate =
    new Date(
      EVENT.start
    );


  const endDate =
    new Date(
      EVENT.end
    );


  const description =
    "يسعد عمر وليان دعوتكم لمشاركتهما فرحة حفل الخطوبة.";


  const icsContent =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Engagement Times//AR
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${Date.now()}@engagement-times
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${escapeICS(EVENT.title)}
LOCATION:${escapeICS(EVENT.venue + " - " + EVENT.city)}
DESCRIPTION:${escapeICS(description)}
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
    "omar-layan-engagement.ics";


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
   تحميل بطاقة الموعد PNG
========================================== */

async function downloadDateCard() {

  if (
    typeof html2canvas ===
    "undefined"
  ) {

    console.log(
      "html2canvas غير متوفر."
    );

    return;

  }


  downloadCardButton.disabled =
    true;


  const originalText =
    downloadCardButton
      .querySelector(
        "span"
      )
      .textContent;


  downloadCardButton
    .querySelector(
      "span"
    )
    .textContent =
      "جاري تجهيز البطاقة...";


  try {

    const canvas =
      await html2canvas(
        downloadCard,
        {

          scale:
            1,

          useCORS:
            true,

          backgroundColor:
            "#f7f1e5",

          logging:
            false

        }
      );


    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.95
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      image;


    link.download =
      "omar-layan-save-the-date.jpg";


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );

  } catch (error) {

    console.error(
      "تعذر إنشاء بطاقة الموعد:",
      error
    );

  } finally {

    downloadCardButton.disabled =
      false;


    downloadCardButton
      .querySelector(
        "span"
      )
      .textContent =
        originalText;

  }

}



downloadCardButton.addEventListener(
  "click",
  downloadDateCard
);



/* ==========================================
   فتح الخريطة
========================================== */

mapLink.href =
  EVENT.mapUrl;
