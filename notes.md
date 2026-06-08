@todo:
* https://codepen.io/bato-web-agency/pen/OPJQppX

# git

## Image Rezise
for i in *.jpg; do magick $i -resize 720x min/$i; done

## Webp
for file in *.jpg; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done

## Github Pages deploy
git subtree push --prefix dist origin gh-pages


# Font Poster
* https://sammlungen.ub.uni-frankfurt.de/drucke/nav/classification/10736375
* https://printedmatterclass.wordpress.com/2012/11/10/type-specimen-sheets-homework-assignment
* https://www.monographbookwerks.com/pages/books/954/type-specimen-poster-janson
* https://www.c82.net/blog/?id=100
* http://idsgn.org/posts/know-your-type-baskerville/
* https://visme.co/blog/typography-infographics/

# Fontlist

## Garamond
* https://sammlungen.ub.uni-frankfurt.de/drucke/nav/classification/10736375
* https://googlefonts.github.io/ebgaramond-specimen/

## Cormorant
* https://fonts.google.com/specimen/Cormorant
* https://prezi.com/p/qekddeacqta-/garamond-vs-cormorant-a-comparative-study/

## Didot
* https://en.wikipedia.org/wiki/Didot_(typeface)
* https://github.com/deepin-community/fonts-gfs-didot

## Gotham
* https://fontandswatch.com.au/resources/gotham-font/
* https://www.obama.org/stories/building-on-the-past-looking-ahead/
* https://www.typeroom.eu/obama-and-gotham-victorious-typography-explained

## Bodoni*
* https://indestructibletype.com/Bodoni.html
* https://en.wikipedia.org/wiki/Bodoni

## Free Font Library
* https://typotheque.luuse.io/
