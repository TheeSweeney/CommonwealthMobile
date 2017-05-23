Directory explanation
=====================

- The font files in the Latin_Greek_Cyrillic directory contains Latin + Greek + Cyrillic scripts.

- The font files in the Arabic folder contain Arabic scripts only.

- The font files in the Hebrew folder contain Hebrew scripts only.

- The font files in the root directory contain all of the above scripts in one font file.



What formats are webfonts available in?
=======================================

We support EOT, WOFF and in many cases WOFF2. We are working towards having WOFF2 available across our library.



What about the TTF and SVG format for webfonts?
===============================================

As there are no browsers which support TTF which do not also support another of the much more compact formats, we do not include TTF files in our webfont downloads. They would simply be one extra unused file to manage for the majority of website administrators.

Only one legacy version of one mobile browser supports SVG webfonts and no other format. As the format doesn't support a large number of typographic features, and that specific browser version’s implementation of SVG is highly unstable with larger font files, we strongly recommend the format is never used. Should someone with this specific browser version visit your site, they will see a fallback font, but the browsing experience will remain stable.



How would I use these fonts on my website?
==========================================

Here is a quick example in CSS which will allow you to use our webfonts on your website:

@font-face {
  font-family: 'DaMaWebFont';
  src: url('webfont.eot'); /* IE9 Compat Modes */
  src: url('webfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('webfont.woff2') format('woff2'), /* Super Modern Browsers */
       url('webfont.woff') format('woff'), /* Pretty Modern Browsers */
}

body {
  font-family: 'DaMaWebFont', Fallback, sans-serif;
}