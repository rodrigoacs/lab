let language = document.documentElement.lang;

function loadContent(language) {
  let elements = document.querySelectorAll('[translate]');
  fetch(`./${language}.json`)
    .then(response => response.json())
    .then(data => {
      elements.forEach(element => {
        let key = element.getAttribute('translate');
        element.innerHTML = data[key];
      });
    })
    .catch(error => console.error(error));
}

loadContent(language);

let changeLanguage = document.getElementById('change-language');
changeLanguage.addEventListener('click', () => {
  language = language === 'en' ? 'pt' : 'en';
  changeLanguage.innerHTML = language === 'en' ? 'Português' : 'English';
  loadContent(language);
});