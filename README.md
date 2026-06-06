# Artist Compare 🎵

A modern web app for comparing music artists across streaming, charts, RIAA certifications, and more.  
Built with Next.js, React, and Tailwind CSS.

---

## 🚀 Live Demo

[View the deployed site here!](https://artistcompare.com/)

---

## ✨ Features

- **Artist Search:** Instantly search and select two artists to compare.
- **Sticky Artist Images:** Artist images stick to the sides as you scroll, making it easy to see which stats belong to which artist.
- **Streaming Stats:** Compare Spotify monthly listeners, total streams, and more.
- **RIAA Certifications:** See Gold, Platinum, and Diamond certifications (coming soon).
- **Chart Performance:** Billboard Hot 100 and 200 stats.
- **Awards:** Grammy wins and nominations.
- **Responsive Design:** Works beautifully on desktop and mobile.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Vercel](https://vercel.com/) (for deployment)

---

## 🔑 Environment Variables

Set these in `.env.local` (local) and in your Vercel project settings (production):

| Variable | Required | Purpose |
| --- | --- | --- |
| `SEATGEEK_CLIENT_ID` | For tickets | SeatGeek Platform API client id (server-only). |
| `SEATGEEK_CLIENT_SECRET` | Optional | SeatGeek client secret for higher rate limits. |
| `SEATGEEK_AFFILIATE_ID` | For payouts | Affiliate id appended as `aid` to ticket links. Without it, links still work but aren't attributed. |
| `POSTGRES_URL` / `DATABASE_URL` | For caching/votes | Neon Postgres connection (also caches tour lookups). |

> The "Get Tickets" button under each artist only appears when SeatGeek reports upcoming shows. If `SEATGEEK_CLIENT_ID` is unset, the feature degrades silently and nothing renders.

---

## 📝 Notes

- If an external API is down, the app will gracefully show fallback messages.

## Next Steps
- Add More Stats
- Add Branding
- SEO Ready


**Made with ❤️ by SK**
