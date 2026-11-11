# datafrankfurt.de

The website of Data Frankfurt, Eduardo Garcia's board of data projects and writing. It's served by GitHub Pages at https://datafrankfurt.de.

## Editing the board

Everything shown on the site lives in **`data.js`**:

- **Add a project**: copy one of the `type: "project"` entries, change the text and URL, and give it an `x`/`y` position inside its frame.
- **Add a LinkedIn post**: add a `type: "post"` card to the `writing` frame (there's a commented example in the file). Delete the "First posts are on their way" note once real posts are in.
- **Move or resize an area**: change `x`, `y`, `w` or `h` on its entry in `frames`.

Commit to `main` and GitHub Pages republishes in about a minute.

## Files

- `index.html` – page shell
- `styles.css` – look and feel
- `board.js` – the canvas: pan, zoom, draggable cards and list view
- `impressum.html` – legal notice (required for German sites)
- `CNAME` – tells GitHub Pages to serve the site on datafrankfurt.de
