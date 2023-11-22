const btns = document.querySelectorAll('button:not(#verify)');
const verify = document.querySelector('#verify');
let opts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function getRandom() {
  let index = Math.floor(Math.random() * opts.length);
  let num = opts[index];
  opts.splice(index, 1);
  return num;
}

let pressed = [];

btns.forEach((btn) => {
  btn.innerText = getRandom() + ' ou ' + getRandom();
  btn.addEventListener('click', () => {
    pressed.push(btn.innerText.split(' ou '));
  })
})

verify.addEventListener('click', verifyPassword)

function verifyPassword() {
  const password = document.querySelector('#password').value.split('');
  for (let i = 0; i < password.length; i++) {
    if (password[i] != pressed[i][0] && password[i] != pressed[i][1]) {
      alert('Senha incorreta!');
      return;
    }
  }
  alert('Senha correta!');
}

