/* ==========================================
   SCRAPBOOK — MEMORY BOOK

   زيد & سارة

   7 فبراير 2027
   الساعة 5:30 مساء
========================================== */


/* ==========================================
   EVENT
========================================== */

const EVENT = {

  start:
    "2027-02-07T17:30:00+03:00",

  end:
    "2027-02-07T20:30:00+03:00",

  title:
    "حفل خطوبة زيد وسارة",

  venue:
    "قاعة روز - الموصل - نينوى"

};



const engagementDate =
  new Date(
    EVENT.start
  ).getTime();



/* ==========================================
   BOOK
========================================== */

const book =
  document.getElementById(
    "book"
  );


const pages =
  Array.from(
    document.querySelectorAll(
      ".scrap-page"
    )
  );


const nextButton =
  document.getElementById(
    "nextPage"
  );


const prevButton =
  document.getElementById(
    "prevPage"
  );


const pageIndicator =
  document.getElementById(
    "pageIndicator"
  );


let currentPage =
  0;


let isFlipping =
  false;



function updateBook() {

  pages.forEach(
    (page, index) => {

      page.classList.remove(
        "is-active",
        "is-before",
        "is-after"
      );


      if (
        index < currentPage
      ) {

        page.classList.add(
          "is-before"
        );

      } else if (
        index === currentPage
      ) {

        page.classList.add(
          "is-active"
        );

      } else {

        page.classList.add(
          "is-after"
        );

      }

    }
  );


  const current =
    String(
      currentPage + 1
    ).padStart(
      2,
      "0"
    );


  const total =
    String(
      pages.length
    ).padStart(
      2,
      "0"
    );


  pageIndicator.textContent =
    `${current} / ${total}`;


  prevButton.disabled =
    currentPage === 0;


  nextButton.disabled =
    currentPage ===
    pages.length - 1;

}



function lockFlip() {

  isFlipping =
    true;


  setTimeout(
    () => {

      isFlipping =
        false;

    },
    760
  );

}



function nextPage() {

  if (
    isFlipping
    ||
    currentPage >=
    pages.length - 1
  ) {

    return;

  }


  currentPage++;


  updateBook();


  lockFlip();

}



function previousPage() {

  if (
    isFlipping
    ||
    currentPage <= 0
  ) {

    return;

  }


  currentPage--;


  updateBook();


  lockFlip();

}



nextButton.addEventListener(
  "click",
  nextPage
);



prevButton.addEventListener(
  "click",
  previousPage
);



updateBook();



/* ==========================================
   SWIPE PAGES
========================================== */

let swipeStartX =
  null;


let swipeStartY =
  null;



book.addEventListener(
  "pointerdown",
  event => {

    /*
      إذا لمس صورة قابلة للسحب
      لا نقلب الصفحة.
    */

    if (
      event.target.closest(
        ".draggable"
      )
    ) {

      return;

    }


    swipeStartX =
      event.clientX;


    swipeStartY =
      event.clientY;

  }
);



book.addEventListener(
  "pointerup",
  event => {

    if (
      swipeStartX === null
    ) {

      return;

    }


    const diffX =
      event.clientX -
      swipeStartX;


    const diffY =
      event.clientY -
      swipeStartY;


    swipeStartX =
      null;


    swipeStartY =
      null;


    /*
      حتى ما يعتبر الـscroll
      تقليب صفحة.
    */

    if (
      Math.abs(diffX) <
      55
      ||
      Math.abs(diffX) <
      Math.abs(diffY)
    ) {

      return;

    }



    /*
      سحب لليسار = الصفحة التالية
    */

    if (
      diffX <
      0
    ) {

      nextPage();

    } else {

      previousPage();

    }

  }
);



/* ==========================================
   DRAGGABLE POLAROIDS
========================================== */

const draggablePhotos =
  document.querySelectorAll(
    ".draggable"
  );



draggablePhotos.forEach(
  photo => {

    let dragging =
      false;


    let startX =
      0;


    let startY =
      0;


    let originalX =
      Number(
        photo.dataset.x
      ) || 0;


    let originalY =
      Number(
        photo.dataset.y
      ) || 0;



    photo.addEventListener(
      "pointerdown",
      event => {

        dragging =
          true;


        startX =
          event.clientX;


        startY =
          event.clientY;


        originalX =
          Number(
            photo.dataset.x
          ) || 0;


        originalY =
          Number(
            photo.dataset.y
          ) || 0;


        photo.classList.add(
          "dragging"
        );


        photo.setPointerCapture(
          event.pointerId
        );


        event.preventDefault();

      }
    );



    photo.addEventListener(
      "pointermove",
      event => {

        if (
          !dragging
        ) {

          return;

        }


        const deltaX =
          event.clientX -
          startX;


        const deltaY =
          event.clientY -
          startY;


        /*
          نحدد مدى الحركة
          حتى ما تختفي الصورة خارج الصفحة.
        */

        const newX =
          Math.max(
            -90,
            Math.min(
              90,
              originalX +
              deltaX
            )
          );


        const newY =
          Math.max(
            -90,
            Math.min(
              90,
              originalY +
              deltaY
            )
          );


        photo.style.setProperty(
          "--x",
          `${newX}px`
        );


        photo.style.setProperty(
          "--y",
          `${newY}px`
        );


        photo.dataset.x =
          newX;


        photo.dataset.y =
          newY;

      }
    );



    function stopDragging(
      event
    ) {

      if (
        !dragging
      ) {

        return;

      }


      dragging =
        false;


      photo.classList.remove(
        "dragging"
      );


      try {

        photo.releasePointerCapture(
          event.pointerId
        );

      } catch (error) {

        /*
          لا نحتاج أي إجراء.
        */

      }

    }



    photo.addEventListener(
      "pointerup",
      stopDragging
    );


    photo.addEventListener(
      "pointercancel",
      stopDragging
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
      "حان موعد كتابة هذه الذكرى";


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
   CALENDAR
========================================== */

const calendarButton =
  document.getElementById(
    "calendarButton"
  );



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
      EVENT.start
    );


  const end =
    new Date(
      EVENT.end
    );


  const content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Scrapbook Engagement//AR
BEGIN:VEVENT
UID:${Date.now()}@memorybook
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${EVENT.title}
LOCATION:${EVENT.venue}
DESCRIPTION:دعوة حفل خطوبة زيد وسارة.
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
    "zaid-sara-engagement.ics";


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

const shareButton =
  document.getElementById(
    "shareButton"
  );


const shareMessage =
  document.getElementById(
    "shareMessage"
  );



async function shareInvitation() {

  const shareData = {

    title:
      "ألبوم ذكريات زيد وسارة",

    text:
      "ندعوكم لتكونوا جزءا من ذكرياتنا.",

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
