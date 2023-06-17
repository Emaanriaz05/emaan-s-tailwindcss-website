import './style.css';

// Photos slider 
const slideBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides =[ ... document.querySelectorAll('[data-slide]')];
let currentIndex = 0;
let isMoving = false;

// btn handle function
function handleSlideBtnClick(e){
    // Todo:see if the slider is moving 
    if(isMoving) return;
    isMoving = true;
    e.currentTarget.id === "prev"
     ? currentIndex--
     : currentIndex++;
    slideContainer.dispatchEvent(new Event("sliderMove"));
}

// remove/add attribute function
const removeDisabledAttribute = (els) => els.forEach(el => el.removeAttribute('disabled')); 
const addDisabledAttribute = (els) => els.forEach(el => el.setAttribute('disabled', 'true')); 

// eventListeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick));
slideContainer.addEventListener('sliderMove', () => { 

    // translate the container to the right/left
slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;

// remove disabled attributes
removeDisabledAttribute(slideBtns);

// renable disabled attribute if needed
currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
})

// transitionend event
slideContainer.addEventListener('transitionend', () => isMoving = false);

// disable image drag events
document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false);

// intersection observer for slider 
const slideObserver = new IntersectionObserver((slide) => {
if(slide[0].isIntersecting){
    addDisabledAttribute([slideBtns[1]]);
}
}, {threshold: .75});
slideObserver.observe(slides[slides.length - 1]);

// Form handler
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// fake sending email to api endpoint
function postEmailToDatabase(email){
console.info(`your email is ${email}`);
return new Promise(resolve => setTimeout(resolve, 2000));
}

// options for submit button
const contactBtnOptions = {
    pending: `<svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M236,128a108,108,0,0,1-216,0c0-42.52,24.73-81.34,63-98.9A12,12,0,1,1,93,50.91C63.24,64.57,44,94.83,44,128a84,84,0,0,0,168,0c0-33.17-19.24-63.43-49-77.09A12,12,0,1,1,173,29.1C211.27,46.66,236,85.48,236,128Z"></path></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>`,
    success: ` <span class="uppercase tracking-wide">
    Thank You
    </span>
    <span class="uppercase tracking-wide">
    🙌
    </span>`
}
async function handleFormSubmit(e){
    e.preventDefault();
   addDisabledAttribute([contactForm, contactBtn]);
   contactBtn.innerHTML = contactBtnOptions.pending;
   const userEmail = contactInput.value;
   contactInput.style.display = "none";
   await postEmailToDatabase(userEmail);
   contactBtn.innerHTML = contactBtnOptions.success;
}

// eventlistener from submit
contactForm.addEventListener('submit', handleFormSubmit);

// fade up observer
function fadeUpObserverCallback(elsToWatch){
    elsToWatch.forEach((el) => {
        if(el.isIntersecting){
            el.target.classList.add('faded');
            // fadeUpObserver.unobserve(el.target);
            // el.target.addEventListener("transitionend", () => {
            //     el.target.classList.remove('fade-up', 'faded');
            // }, { once: true})
        }
    })
}
const fadeUpObserverOptions = {
 threshold: .6,
}
const fadeUpObserver = new IntersectionObserver(
    fadeUpObserverCallback,
    fadeUpObserverOptions
);
document.querySelectorAll('.fade-up').forEach((item) => {
    fadeUpObserver.observe(item);
})