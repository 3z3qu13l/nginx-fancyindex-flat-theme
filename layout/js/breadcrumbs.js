/* This file is part of nginx-fancyindex-flat-theme.
 *
 * nginx-fancyindex-flat-theme is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * nginx-fancyindex-flat-theme is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see
 *
 *  http://www.gnu.org/licenses/
 *
 *
 * Copyright (C)
 *  2018-2024 Alexander Haase <ahaase@alexhaase.de>
 *
 *
 * NOTE: The following comment will be used as short version of the copyright
 *       notice above to be included in compressed files, too.
 */

/*!
 *
 * This file is part of the nginx-fancyindex-flat-theme, licensed under the GNU
 * General Public License. See the LICENSE file for details.
 *
 * Copyright (C)
 *  2018-2024 Alexander Haase <ahaase@alexhaase.de>
 */

/**
 * Print the breadcrumbs.
 *
 * This function will generate the breadcrumbs for the current page and updates
 * the 'breadcrumbs' element with the list of crumbs.
 */
function generateBreadcrumbs()
{
  /**
   * Create a single breadcrumb.
   * @param string name   the name of the breadcrumb
   * @param string url    the url of the breadcrumb
   * @param string active whether this breadcrumb is active or not
   * @return HTMLElement the breadcrumb element
   */
  function crumb(name, url, active)
  {
    const item = document.createElement('li');
    item.className = 'breadcrumb-item';

    /* The name comes from the URL (i.e. a directory name) and must be set as
     * text, never as HTML, to prevent script injection. */
    if (active)
      {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
        item.textContent = name;
      }
    else
      {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = name;
        item.appendChild(link);
      }

    return item;
  }

  /**
   * Decode a path segment of the URL.
   * @param string segment the URL-encoded segment
   * @return string the decoded segment, or the segment itself if it isn't valid
   *                UTF-8 (e.g. directory names in Latin-1)
   */
  function decode(segment)
  {
    try
      {
        return decodeURIComponent(segment);
      }
    catch (e)
      {
        return segment;
      }
  }

  /* Get the path of the current directory and split it into the list of paths.
   * The trailing slash will be removed to avoid an empty breadcrumb at the end
   * of the list. */
  var crumbs = window.location.pathname.replace(/\/$/, '').split('/');

  /* Iterate over the breadcrumbs and generate a link for each crumb. The home
   * directory will have the special name 'Home' and the current directory will
   * not be a link, but just plain text. */
  var nav = document.getElementById('breadcrumbs');
  var path = '';
  for (var i = 0; i < crumbs.length; i++)
    {
      path += crumbs[i] + '/';
      nav.appendChild(crumb((i == 0) ? 'Home' : decode(crumbs[i]), path,
                            (i == crumbs.length - 1)));
    }
}

/* Called from here instead of an inline script, so a strict CSP can be used. */
document.addEventListener('DOMContentLoaded', generateBreadcrumbs);
