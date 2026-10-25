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
 * Apply the styling of the directory listing table.
 *
 * The default directory listing table can be styled only basically via CSS.
 * This function will apply additional styles to it and adds an extra column for
 * icons.
 */
function generateList()
{
  /**
   * Get the filetype of a specific file based on the file extension.
   * @param string filename the filename to be checked
   * @return string the file's filetype
   */
  function getFileType(filename)
  {
    /* First, check if the file is a directory (i.e. has a trailing slash). */
    if (filename.endsWith('/'))
      return 'folder';

    /* For all other kinds of files, check the file extension (converted to
     * lower case to ignore the extension's case). */
    switch (filename.split('.').pop().toLowerCase())
      {
      case 'txt':
        return 'text';

      case 'pdf':
        return 'pdf';

      case 'bmp':
      case 'gif':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'tif':
      case 'tiff':
        return 'image';

      case 'aac':
      case 'aiff':
      case 'm4a':
      case 'mp3':
      case 'ogg':
      case 'opus':
      case 'wav':
        return 'audio';

      case 'amv':
      case 'avi':
      case 'flv':
      case 'm4v':
      case 'mkv':
      case 'mov':
      case 'mp4':
      case 'm4p':
      case 'mpeg':
      case 'mpg':
      case 'ogv':
      case 'vob':
      case 'webm':
      case 'wmv':
        return 'video';

      case '7z':
      case 'a':
      case 'apk':
      case 'ar':
      case 'bin':
      case 'bz2':
      case 'cab':
      case 'dmg':
      case 'gz':
      case 'iso':
      case 'jar':
      case 'lz':
      case 'lzma':
      case 'lzo':
      case 'pak':
      case 'partimg':
      case 'rar':
      case 's7z':
      case 'tar':
      case 'tbz2':
      case 'tgz':
      case 'tlz':
      case 'txz':
      case 'xz':
      case 'cbz':
      case 'cbr':
        return 'archive';

      case 'doc':
      case 'docx':
      case 'odt':
      case 'rtf':
        return 'word';

      case 'csv':
      case 'ods':
      case 'xls':
      case 'xlsx':
        return 'excel';

      case 'odp':
      case 'ppt':
      case 'pptx':
        return 'powerpoint';

      case 'c':
      case 'class':
      case 'cpp':
      case 'cs':
      case 'h':
      case 'hpp':
      case 'hxx':
      case 'java':
      case 'py':
      case 'sh':
      case 'swift':
      case 'vb':
        return 'code';
      }
  }

  /* Icon element cloned for every row, which is much cheaper than parsing HTML
   * for each row in large directories. */
  const iconTemplate = document.createElement('i');
  iconTemplate.setAttribute('aria-hidden', 'true');

  /**
   * Get the font awesome icon to be used for a specific filetype.
   * @param string filetype the filetype for which an icon is required
   * @return HTMLElement the icon element to be used
   */
  function getIcon(filetype)
  {
    /**
     * Get the font awesome class of the icon to be used.
     * @param string filetype the filetype for which an icon is required
     * @return string the icon class to be used
     */
    function getFontAwesomeClass(filetype)
    {
      switch (filetype)
        {
        case 'folder':
          return 'fa-folder';

        case 'archive':
        case 'audio':
        case 'code':
        case 'excel':
        case 'image':
        case 'pdf':
        case 'powerpoint':
        case 'text':
        case 'video':
        case 'word':
          return `fa-file-${filetype}`;

        /* If none of the previous types matched, use a generic file icon. */
        default:
          return 'fa-file';
        }
    }

    /*
      Return the file icon element to be used for the file passed to this function.
      fa-regular or fa-solid can be used
    */
    const icon = iconTemplate.cloneNode();
    icon.className = `fa-solid ${getFontAwesomeClass(filetype)}`;
    return icon;
  }

  const list = document.getElementById("list");

  /* Remove the default style attributes and add the bootstrap table classes. By
   * default, text will be not wrapped. However, long filenames will be, as they
   * use the 'filename' class (see below). */
  list.removeAttribute("cellpadding");
  list.removeAttribute("cellspacing");
  list.classList.add('table', 'table-sm', 'table-hover', 'text-nowrap');

  /* As file size and last-modified date will be hidden at mobile devices, also
   * hide the the table header for mobile devices, as it's unnecessary for the
   * single remaining cell containing the filename. */
  list.tHead.children[0].classList.add('d-none', 'd-md-table-row');

  /* Remove the 'Parent Directory' row, as the navigation is covered by the
   * breadcrumbs. It is checked by its link, as fancyindex omits it at the root
   * and with 'fancyindex_hide_parent_dir on'. */
  const parent = list.tBodies[0].rows[0];
  if (parent && parent.querySelector('a[href^="../"]'))
    parent.remove();

  /* Iterate over all rows (including the thead) to add individual classes for
   * each cell or adding new cells. The rows are copied first: 'list.rows' is
   * live and re-scanned after each inserted cell, which is quadratic. */
  const rows = Array.from(list.rows);
  for (let i = 0; i < rows.length; i++)
    {
      const row = rows[i];

      /* Add a new cell for the file-type icon. */
      const iconCell = row.insertCell(0);
      if (i > 0)
        /* The link is used rather than the displayed name, which fancyindex
         * truncates (losing the extension) beyond 'fancyindex_name_length'.
         * Its query (the sort order, added to directory links) is ignored. */
        iconCell.appendChild(getIcon(getFileType(row.cells[1].children[0].getAttribute('href').split('?')[0])));

      /* Set the classes for all cells. All cells except the filename will fit
       * their contents. The filename cell is the only allowed to wrap. The last
       * two cells (file size and last-modified date) will be hidden on small
       * (i.e. mobile) devices.*/
      row.cells[0].classList.add('col-auto');
      row.cells[1].classList.add('col', 'filename');
      row.cells[2].classList.add('col-auto', 'd-none', 'd-md-table-cell');
      row.cells[3].classList.add('col-auto', 'd-none', 'd-md-table-cell');
    }
}

/* Called from here instead of an inline script, so a strict CSP can be used. */
document.addEventListener('DOMContentLoaded', generateList);
