# Flat theme for nginx's fancyindex module

[![](https://img.shields.io/github/issues-raw/alehaa/nginx-fancyindex-flat-theme.svg?style=flat-square)](https://github.com/alehaa/nginx-fancyindex-flat-theme/issues)
[![](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](LICENSE)

![](doc/screenshot.png)


## About

The [fancyindex module](https://github.com/aperezdc/ngx-fancyindex) of
[nginx](http://nginx.org/) has the powerful capability to be customizable.
Instead of using an external application, this gives us the ability to use
just the webserver's capabilities to generate beautiful directory listings.

This theme provides a simple, flat interface based on
[Bootstrap 4](https://getbootstrap.com), [Font Awesome](https://fontawesome.com)
and (for easy navigation in galleries)
[lightbox2](http://lokeshdhakar.com/projects/lightbox2/). In combination with
the browser's preview capability, accessing the majority of files should be
possible, giving the user easy access without a single line of server-side
dynamic code.


## Usage

1. Get the latest resources from [GitHub releases][releases], or build them
   yourself by running `make` inside this repository. Instructions on how to
   build the resources can be found [below](#build).
1. Copy these files into any location accessible by *nginx*.
1. Configure your vhost to use the theme's resources for fancyindex:
    ```
    # Fancyindex
    fancyindex             on;
    fancyindex_header      "/theme/header.html";
    fancyindex_footer      "/theme/footer.html";
    fancyindex_show_path   off;
    fancyindex_name_length 255;
    fancyindex_exact_size  off;
    fancyindex_localtime   on;

    location /theme/{
        alias /srv/www/fileserver/theme/;
    }
    ```

[releases]: https://github.com/alehaa/nginx-fancyindex-flat-theme/releases


## Build

Instead of using pre-built sources, you can build them on a local machine. For
convenience, a [Dockerfile](Dockerfile) is provided that creates a container
with all the necessary tools to compile the sources. You can easily build the
theme using the following commands:

```
docker build -t fancyindex-flat .
docker run --rm -it -v ./:/mnt -w /mnt fancyindex-flat make
```

The compiled sources for the theme will be located in the `build` directory.


## License

The nginx-fancyindex-flat-theme is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

This software is distributed in the hope that it will be useful, but **WITHOUT
ANY WARRANTY**; without even the implied warranty of **MERCHANTABILITY** or
**FITNESS FOR A PARTICULAR PURPOSE**. A Copy of the GNU General Public License
can be found in the [LICENSE](LICENSE) file.

&copy; 2018-2024 Alexander Haase
