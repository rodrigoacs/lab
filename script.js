loadPage('home')

const changeLanguageIcon = document.getElementById('change-language')
const main = document.querySelector('main')
const root = document.documentElement
const img = document.getElementById('change-theme-img')
const theme = document.getElementById('change-theme')
const languageOptions = {
  'en-US': {
    icon: 'https://img.icons8.com/fluency/48/brazil-circular.png',
    jsonFile: './en-US.json',
  },
  'pt-BR': {
    icon: 'https://img.icons8.com/fluency/48/usa-circular.png',
    jsonFile: './pt-BR.json',
  },
}

let language = navigator.language || navigator.userLanguage
let links = document.querySelectorAll('.link:not(#change-language)')
links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault()
    const pageId = this.getAttribute('href')
    loadPage(pageId)
  })
})

window.onload = function () {
  loadContent(language)
  updateLanguageIcon(language)
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setDark(root, img)
  } else {
    setLight(root, img)
  }
}

function updateLanguageIcon(language) {
  changeLanguageIcon.innerHTML = `<img width="24" height="24" src="${languageOptions[language].icon}" alt="${language}-circular"/>`
}

function loadPage(pageId) {
  fetch(`${pageId}.html`)
    .then(response => response.text())
    .then(data => {
      main.innerHTML = data
      document.title = `${pageId} | rodrigoacs.com`
      highlightLink(pageId)
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

function loadContent(language) {
  let elements = document.querySelectorAll('[translate]')
  fetch(languageOptions[language].jsonFile)
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
    }, 500)
  }
}

const observer = new MutationObserver(() => {
  loadContent(language)
  activeDownload()
}).observe(document.body.querySelector('.ajax'), { attributes: true, childList: true, subtree: false })

theme.addEventListener('click', changeTheme)

function changeTheme() {
  if (root.classList.contains('light-mode')) {
    setDark(root, img)
  } else {
    setLight(root, img)
  }
}

function setDark(root, img) {
  root.classList.remove('light-mode')
  root.classList.add('dark-mode')
  img.src = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/3D/sun_3d.png'
}

function setLight(root, img) {

  root.classList.remove('dark-mode')
  root.classList.add('light-mode')
  img.src = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/New%20moon/3D/new_moon_3d.png'
}