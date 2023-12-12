<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$servername = $_ENV['MYSQL_HOST'];
$database = $_ENV['MYSQL_USER'];
$username = $_ENV['MYSQL_USER'];
$password = $_ENV['MYSQL_PASSWORD'];

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

if (isset($_GET["search"]) && $_GET["search"] != "") {

  $query = "SELECT 
            b.title,
            b.author_sort,
            GROUP_CONCAT(t.name) as tags
          FROM 
            books_tags_link btl
            INNER JOIN books b ON btl.book = b.id
            INNER JOIN tags t ON btl.tag = t.id
          WHERE
            b.title LIKE '%" . $_GET["search"] . "%'
          GROUP BY 
            b.path
          ORDER BY 
            b.author_sort";

  $result = mysqli_query($conn, $query);

  if (mysqli_num_rows($result) > 0) {
    echo "
    <table border='1'>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Author</th>
        <th>Tags</th>
      </tr>";
    $i = 0;
    while ($row = mysqli_fetch_assoc($result)) {
      $i++;
      echo "
      <tr>
        <td>" . $i . "</td>
        <td>" . $row["title"] . "</td>
        <td>" . $row["author_sort"] . "</td>
        <td>" . $row["tags"] . "</td>
      </tr>";
    }
    echo "</table>";
  } else {
    echo "0 results";
  }
} else {
  echo "0 results";
}

mysqli_close($conn);
