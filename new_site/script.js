const links = document.querySelectorAll('nav a')

function loadPage(pageId) {
  fetch(`${pageId}.html`)
    .then(response => response.text())
    .then(data => {
      document.querySelector('main').innerHTML = data
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

const observer = new MutationObserver(list => {
  if (document.querySelector('.cv-page')) {
    const downloadLink = document.getElementById('download');

    downloadLink.addEventListener('click', function (e) {
      const confirmed = confirm('Realizar o download?');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  }
}).observe(document.body, { attributes: true, childList: true, subtree: true });

