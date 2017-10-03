echo "<html>"
echo "<head>"
echo "<title>Images</title>"
echo "<link rel='stylesheet' type='text/css' href='logolist.css'>"
echo "</head>"
echo "<body>"

set CURLEAGUE=""

for i in `find . -name "*.svg" -not -name "*.svg.bak.svg" -type f`; do


  BASEDIR=$(dirname "$i")
  FILENAME=$(basename "$i")
  if [ "$BASEDIR" != "$CURLEAGUE" ]
  then
    CURLEAGUE="$BASEDIR"
    echo "<h1>$BASEDIR</h1>"
  fi

  echo "<div class='logo-list'>"
  echo "$FILENAME<br>"
  echo "<span class='logo small'><img src='$i' /></span>"
  echo "<span class='logo medium'><img src='$i' /></span>"
  echo "<span class='logo large'><img src='$i' /></span>"
  echo "</div>"
done

echo "</body>"
echo "</html>"

