let card = document.querySelector('.cardFlip');
let btns = document.querySelectorAll('.commentIcon');

btns.forEach((btn) => {
  btn.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
  });
});
