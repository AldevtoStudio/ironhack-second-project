let card = document.querySelector('.cardFlip');
let btns = document.querySelectorAll('.commentIcon');

if (card.classList.contains('is-flipped')) {
  card.classList.remove('is-flipped');

  setTimeout(() => {
    card.classList.toggle('is-flipped');
  }, 300);
}

btns.forEach((btn) => {
  btn.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
  });
});
