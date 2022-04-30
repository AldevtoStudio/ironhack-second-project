let submitButton = document.getElementById('create-button');
let count = 0;
let createInputs = document.getElementsByClassName('create-input');
console.log(createInputs.length);
submitButton.addEventListener('click', () => {
  for (let item of createInputs) {
    if (item.value === '') {
      console.log(item + 'EMPTY');
      count++;
    }
  }
});

function required() {
  if (count === createInputs.length) {
    console.log('alles leer');
    return false;
  }
  console.log('passt');
  return true;
}
