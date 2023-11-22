<?php
$servername = "";
$database = "";
$username = "";
$password = "";

$conn = mysqli_connect($servername, $username, $password, $database);

$query = "SELECT 
            b.title,
            b.author_sort,
            GROUP_CONCAT(t.name) as tags
          FROM 
            books_tags_link btl
            INNER JOIN books b ON btl.book = b.id
            INNER JOIN tags t ON btl.tag = t.id
          GROUP BY 
            b.path
          ORDER BY 
            b.author_sort";

$result = mysqli_query($conn, $query);

echo "<h1>Books</h1>";
echo "<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/water.css@2/out/water.css'>";

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

mysqli_close($conn);
?>