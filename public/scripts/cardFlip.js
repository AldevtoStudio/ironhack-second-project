let card = document.querySelector('.cardFlip');
let btns = document.querySelectorAll('.commentIcon');
let firstTime = true;
let start = null;

window.requestAnimationFrame((timestamp) => {
  if (!start) start = timestamp;
  let progress = timestamp - start;

  if (card.classList.contains('is-flipped') && firstTime)
    card.classList.remove('is-flipped');

  if (progress >= 150 && firstTime) {
    card.classList.toggle('is-flipped');
    let firstTime = false;
  }
});

if (card.classList.contains('is-flipped')) {
  window.setTimeout(() => {}, 150);
}

const firstTimeFlip = () => {};

btns.forEach((btn) => {
  btn.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
  });
});
