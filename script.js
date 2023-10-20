loadPage('home')

const changeLanguageIcon = document.getElementById('change-language')
const main = document.querySelector('main')
const root = document.documentElement
const img = document.getElementById('change-theme-img')
const theme = document.getElementById('change-theme')
const projectSvg = document.querySelectorAll('.project-svg')
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
  window.matchMedia('(prefers-color-scheme: dark)').matches ? setDark(root, img) : setLight(root, img)
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
  root.classList.contains('dark-mode') ? setDark(root, img) : setLight(root, img)
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
  let tech = document.getElementById("tech")
  tech.addEventListener("change", (() => filterTech(tech.value)))
}).observe(document.body.querySelector('.ajax'), { attributes: true, childList: true, subtree: false })

theme.addEventListener('click', changeTheme)

function changeTheme() {
  root.classList.contains('light-mode') ? setDark(root, img) : setLight(root, img)
}

function setDark(root, img) {
  let projectSvg = document.querySelectorAll('.project-svg')
  root.classList.remove('light-mode')
  root.classList.add('dark-mode')
  img.src = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/3D/sun_3d.png'
  projectSvg.forEach(svg => {
    svg.src = './assets/github-project-dark.svg'
  })
}

function setLight(root, img) {
  let projectSvg = document.querySelectorAll('.project-svg')
  root.classList.remove('dark-mode')
  root.classList.add('light-mode')
  img.src = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/New%20moon/3D/new_moon_3d.png'
  projectSvg.forEach(svg => {
    svg.src = './assets/github-project-light.svg'
  })
}

function filterTech(tech) {
  const projects = document.querySelectorAll('.project')
  projects.forEach((project) => {
    if (!project.children[2].firstChild.classList.contains(`${tech}`)) {
      project.style.display = "none"
    } else {
      project.style.display = "block"
    }
    if (tech === "all") {
      project.style.display = "block"
    }
  })

}

