#!/bin/sh
# Build build/header_full.html: the header with the theme's CSS and JS inlined,
# so theme.css and js/ don't need to be served. The vendor/ directory is still
# required, and the inline code is incompatible with a strict CSP.
set -e

make all

awk '/href="[^"]*\/theme\.css[?"]/ || /src="[^"]*\/js\/(breadcrumbs|list)\.js[?"]/ { next }
     /<\/head>/ {
       print "<style>"; system("cat build/theme.css"); print "</style>"
       print "<script>"; system("cat build/js/breadcrumbs.js build/js/list.js"); print "</script>"
     }
     1' build/header.html > build/header_full.html
