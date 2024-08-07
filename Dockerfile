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

FROM debian

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && \
    apt install -y \
        make \
        uglifyjs \
        node-less \
        node-less-plugin-clean-css \
        && \
    rm -rf /var/lib/apt/lists/*
