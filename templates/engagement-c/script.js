/* ==========================================
   OUR STORY
   يوسف & مريم
========================================== */


/* ==========================================
   العناصر
========================================== */

const introScreen =
  document.getElementById(
    "introScreen"
  );


const startStoryButton =
  document.getElementById(
    "startStoryButton"
  );


const storyContent =
  document.getElementById(
    "storyContent"
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


const heartsBackground =
  document.getElementById(
    "heartsBackground"
  );


const galleryTrack =
  document.getElementById(
    "galleryTrack"
  );


const galleryPrev =
  document.getElementById(
    "galleryPrev"
  );


const galleryNext =
  document.getElementById(
    "galleryNext"
  );



/* ==========================================
   الحالة
========================================== */

let storyStarted =
  false;


let galleryDragging =
  false;


let galleryStartX =
  0;


let galleryScrollStart =
  0;



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
   بدء الحكاية
========================================== */

async function startStory() {

  if (
    storyStarted
  ) {

    return;

  }


  storyStarted =
    true;


  introScreen.classList.add(
    "hidden"
  );


  musicControl.classList.add(
    "visible"
  );


  try {

    await bgMusic.play();


    updateMusicIcon();

  } catch (error) {

    console.log(
      "المتصفح منع التشغيل التلقائي للموسيقى."
    );

  }


  setTimeout(
    () => {

      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    },
    400
  );

}



startStoryButton.addEventListener(
  "click",
  startStory
);



/* ==========================================
   القلوب المتحركة بالخلفية
========================================== */

function createFloatingHearts() {

  const heartsCount =
    18;


  for (
    let i = 0;
    i < heartsCount;
    i++
  ) {

    const heart =
      document.createElement(
        "span"
      );


    heart.className =
      "floating-heart";


    heart.textContent =
      "♡";


    const size =
      14 +
      Math.random() *
      23;


    heart.style.fontSize =
      `${size}px`;


    heart.style.left =
      `${Math.random() * 100}%`;


    heart.style.animationDuration =
      `${
        15 +
        Math.random() *
        18
      }s`;


    heart.style.animationDelay =
      `${
        Math.random() *
        15
      }s`;


    heartsBackground.appendChild(
      heart
    );

  }

}



createFloatingHearts();



/* ==========================================
   ظهور العناصر أثناء النزول
========================================== */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );



const observerOptions = {

  threshold:
    0.14,

  rootMargin:
    "0px 0px -40px 0px"

};



const revealObserver =
  new IntersectionObserver(

    (
      entries,
      observer
    ) => {

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

    observerOptions

  );



revealElements.forEach(
  element => {

    revealObserver.observe(
      element
    );

  }
);



/* ==========================================
   تأثير خفيف على الصور أثناء Scroll
========================================== */

const chapterPhotos =
  document.querySelectorAll(
    ".chapter-photo"
  );



function animateStoryPhotos() {

  chapterPhotos.forEach(
    photo => {

      const rect =
        photo.getBoundingClientRect();


      const viewportCenter =
        window.innerHeight / 2;


      const photoCenter =
        rect.top +
        rect.height / 2;


      const difference =
        (
          photoCenter -
          viewportCenter
        )
        /
        window.innerHeight;


      const movement =
        difference *
        12;


      photo.style.translate =
        `0 ${movement}px`;

    }
  );

}



window.addEventListener(
  "scroll",
  animateStoryPhotos,
  {
    passive: true
  }
);



animateStoryPhotos();



/* ==========================================
   أزرار Gallery
========================================== */

function scrollGallery(
  amount
) {

  galleryTrack.scrollBy({

    left: amount,

    behavior:
      "smooth"

  });

}



galleryPrev.addEventListener(
  "click",
  () => {

    scrollGallery(
      280
    );

  }
);



galleryNext.addEventListener(
  "click",
  () => {

    scrollGallery(
      -280
    );

  }
);



/* ==========================================
   السحب بالماوس للـ Gallery
========================================== */

galleryTrack.addEventListener(
  "mousedown",
  event => {

    galleryDragging =
      true;


    galleryTrack.classList.add(
      "dragging"
    );


    galleryStartX =
      event.pageX;


    galleryScrollStart =
      galleryTrack.scrollLeft;

  }
);



window.addEventListener(
  "mouseup",
  () => {

    galleryDragging =
      false;


    galleryTrack.classList.remove(
      "dragging"
    );

  }
);



galleryTrack.addEventListener(
  "mousemove",
  event => {

    if (
      !galleryDragging
    ) {

      return;

    }


    event.preventDefault();


    const distance =
      event.pageX -
      galleryStartX;


    galleryTrack.scrollLeft =
      galleryScrollStart -
      distance;

  }
);



/* ==========================================
   دعم Touch إضافي
========================================== */

let touchStartX =
  0;


let touchScrollStart =
  0;



galleryTrack.addEventListener(
  "touchstart",
  event => {

    touchStartX =
      event.touches[0].pageX;


    touchScrollStart =
      galleryTrack.scrollLeft;

  },
  {
    passive: true
  }
);



galleryTrack.addEventListener(
  "touchmove",
  event => {

    const currentX =
      event.touches[0].pageX;


    const difference =
      currentX -
      touchStartX;


    galleryTrack.scrollLeft =
      touchScrollStart -
      difference;

  },
  {
    passive: true
  }
);



/* ==========================================
   تحريك عنوان البداية بشكل بسيط
========================================== */

const introPaper =
  document.querySelector(
    ".intro-paper"
  );



introScreen.addEventListener(
  "mousemove",
  event => {

    if (
      window.innerWidth <
      700
    ) {

      return;

    }


    const x =
      (
        event.clientX /
        window.innerWidth -
        0.5
      )
      *
      8;


    const y =
      (
        event.clientY /
        window.innerHeight -
        0.5
      )
      *
      8;


    introPaper.style.transform =
      `translate(${x}px, ${y}px)`;

  }
);



introScreen.addEventListener(
  "mouseleave",
  () => {

    introPaper.style.transform =
      "translate(0, 0)";

  }
);
