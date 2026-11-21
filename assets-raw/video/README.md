# Source video clips

Put your own clips here (phone footage is fine): the Satara hills, a stage or event, you at work. The
more of your own footage the site uses, the less generic it looks.

Export finished clips to `client/public/video/` (H.264 MP4, muted, ideally under 2 MB, 1280 px wide
is plenty) and switch them on in `client/src/content/media.ts`:

- `heroLoop`: 8–12 s seamless loop for the hero background (made in Canva from these clips).
- `aboutScrub`: a clip that goes from the hills to a stage; scrolling through About plays it.
- Project demos: add `"demo": "/video/<slug>.mp4"` to a project in `shared/projects.json`.

Give each clip a `poster` still (a JPEG frame). Visitors with reduced motion, Data Saver or a slow
connection always get the still.
