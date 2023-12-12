<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calibre Online</title>
</head>

<body>
  <h1>Pesquisar</h1>
  <input type="text" name="search" id="search" placeholder="Pesquisar">
  <div id="result"></div>
</body>

<script>
  document.getElementById("search").focus();

  document.getElementById("search").addEventListener("keyup", function(event) {
    fetch("search.php?search=" + document.getElementById("search").value)
      .then(response => response.text())
      .then(data => {
        document.getElementById("result").innerHTML = data;
      });
  });
</script>

</html>