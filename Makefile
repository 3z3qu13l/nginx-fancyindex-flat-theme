# This file is part of nginx-fancyindex-flat-theme.
#
# nginx-fancyindex-flat-theme is free software: you can redistribute it and/or
# modify it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# nginx-fancyindex-flat-theme is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
# Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see
#
#  http://www.gnu.org/licenses/
#
#
# Copyright (C)
#  2018-2024 Alexander Haase <ahaase@alexhaase.de>

# Incremental build; use 'make clean all' for a full rebuild.
.PHONY: all
all: build/theme.css \
	build/js/list.js \
	build/js/breadcrumbs.js \
	build/header.html \
	build/footer.html \
	build/vendor/css/bootstrap.min.css \
	build/vendor/css/fontawesome.min.css \
	build/vendor/webfonts/fa-regular-400.woff2 \
	build/vendor/webfonts/fa-solid-900.woff2

# Generate the build directory if it doesn't exist yet.
build:
	mkdir -p build build/js

# The following definitions will be used to generate CSS files from the
# corresponding LESS files.
#
# NOTE: The tools of the project (installed by 'npm ci') are used rather than
#       any global ones, whose versions may not work with the current Node.js.
LESSC ?= node node_modules/less/bin/lessc
LESSC_FLAGS ?= --clean-css
build/%.css: layout/%.less | build
	$(LESSC) -M $< $@ > layout/$*.d
	$(LESSC) $(LESSC_FLAGS) $< $@

# Include the generated dependency list of the main less file to regenerate the
# CSS file, if one of its imported files is touched.
-include layout/theme.d

# The following definitions will be used to minify the JavaScript files of the
# theme.
#
# NOTE: The project's uglifyjs (installed by 'npm ci') is used, see above.
UGLIFYJS ?= node node_modules/uglify-js/bin/uglifyjs
UGLIFYJS_FLAGS = --compress
build/js/%.js: layout/js/%.js | build
	$(UGLIFYJS) $(UGLIFYJS_FLAGS) -- $< > $@

# Bootstrap and Font Awesome are served locally from the npm packages, so no
# third-party script runs on the file server and a strict CSP can be used.
#
# NOTE: Run 'npm ci' before 'make' to install these packages.
FONTAWESOME = node_modules/@fortawesome/fontawesome-free
build/vendor/css/bootstrap.min.css: node_modules/bootstrap/dist/css/bootstrap.min.css
	mkdir -p $(@D)
	cp $< $@

build/vendor/css/fontawesome.min.css: $(FONTAWESOME)/css/fontawesome.min.css \
	$(FONTAWESOME)/css/regular.min.css \
	$(FONTAWESOME)/css/solid.min.css
	mkdir -p $(@D)
	cat $^ > $@

build/vendor/webfonts/%.woff2: $(FONTAWESOME)/webfonts/%.woff2
	mkdir -p $(@D)
	cp $< $@

# Most of the files just need to be copied into the build directory. This rule
# will match all files, that are not matched by any other (specialized) rule
# above.
build/%: layout/% | build
	cp $< $@

# Clean the build directory.
.PHONY: clean
clean:
	rm -rf build layout/*.d

# Always built from scratch, so the archive never contains stale files. The
# steps run in sequence, even with 'make -j'.
.PHONY: release
release:
	$(MAKE) clean
	$(MAKE) all
	tar -cvzf nginx-fancyindex-flat-theme.tar.gz build
