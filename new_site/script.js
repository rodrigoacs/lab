function navigate(path) {
  window.location.href = `http://127.0.0.1:5500/new_site/${path}.html`
}

function highlight(id) {
  document.getElementById(`${id}`).classList.add('active')
}

var href = window.location.href.split("/").slice(-1)[0].split(".")[0]

switch (href) {
  case 'index' || "":
    highlight(href)
    break;
  case 'blog':
    highlight(href)
  case 'cv':
    highlight(href)

  default:
    break;
}

let links = document.getElementsByTagName('a')

for (const link of links) {
  link.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case 'home':
        navigate('index')
        break

      case 'blog':
        navigate('blog')
        break

      case 'cv':
        navigate('cv')
        break
    }
  })
}