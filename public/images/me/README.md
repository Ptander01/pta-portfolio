# Photos of Patrick

Each slot probes for its file and stays hidden until it exists — drop a file
in with the right name and it appears. No code change needed.

| Filename        | Status      | Appears on                        | The photo |
|-----------------|-------------|-----------------------------------|-----------|
| `office.webp`   | **wired**   | `/about`, "Off the clock"         | Home office, desk from the left — Patrick's pick |
| `portrait.jpg`  | waiting     | `/about` hero, beside the headline | Full-body outdoor, flannel + quilted vest |
| `headshot.jpg`  | waiting     | `/resume` header                  | Navy suit, orange striped bowtie |
| `speaking.jpg`  | waiting     | `/resume`, Speaking & Presenting  | Red bowtie, light blue shirt — conference shot |
| `journal.jpg`   | waiting     | `/contact`                        | Journal, candle, window — fronted the old guest book |

`.jpg`, `.png`, and `.webp` all work, but the extension in the filename must
match the real file — the slot checks content-type, so a mislabelled file
stays hidden rather than rendering broken.

Anything over ~2000px wide is worth converting to WebP first, the way
`office.webp` was (2048px JPEG → 1600px WebP, 326 KB → 153 KB).
