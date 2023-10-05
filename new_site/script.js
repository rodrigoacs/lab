const links = document.querySelectorAll('nav a:not(#change-language')
const changeLanguageIcon = document.getElementById('change-language');
const main = document.querySelector('main')
const languageOptions = {
  'en-US': {
    icon: 'https://img.icons8.com/fluency/48/brazil-circular.png',
    jsonFile: './en-US.json',
  },
  'pt-BR': {
    icon: 'https://img.icons8.com/fluency/48/usa-circular.png',
    jsonFile: './pt-BR.json',
  },
};

let language = navigator.language || navigator.userLanguage

window.onload = function () {
  loadContent(language)
  updateLanguageIcon(language)
}

function updateLanguageIcon(language) {
  changeLanguageIcon.innerHTML = `<img width="24" height="24" src="${languageOptions[language].icon}" alt="${language}-circular"/>`;
}

function loadPage(pageId) {
  fetch(`${pageId}.html`)
    .then(response => response.text())
    .then(data => {
      main.innerHTML = data
    })
    .catch(error => console.error('Error:', error))
}

function highlightLink(pageId) {
  links.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === pageId) {
      link.classList.add('active')
    }
  })
}

links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault()
    const pageId = this.getAttribute('href')
    highlightLink(pageId)
    loadPage(pageId)
  })
})

loadPage('home')

function loadContent(language) {
  let elements = document.querySelectorAll('[translate]')
  fetch(`${languageOptions[language].jsonFile}`)
    .then(response => response.json())
    .then(data => {
      elements.forEach(element => {
        let key = element.getAttribute('translate')
        element.innerHTML = data[key]
      })
    })
    .catch(error => console.error(error))
}

let changeLanguage = document.getElementById('change-language')
changeLanguage.addEventListener('click', () => {
  language = language === 'en-US' ? 'pt-BR' : 'en-US'
  updateLanguageIcon(language)
  loadContent(language)
  activeDownload()
})

function activeDownload() {
  if (document.querySelector('.cv-page')) {
    setTimeout(() => {
      let downloadButton = document.getElementById('download')
      downloadButton.addEventListener('click', () => {
        window.print()
      })
    }, 500);
  }
}

const observer = new MutationObserver(() => {
  loadContent(language)

  activeDownload()
}).observe(document.body.querySelector('.ajax'), { attributes: true, childList: true, subtree: false });