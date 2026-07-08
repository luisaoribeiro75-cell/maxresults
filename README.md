# MaxResults Workout Tracker

Client-facing workout tracker pages for MaxResults personal training.

## Structure

Each client gets a dedicated folder under `treino/<client-name>/`:
- `index.html` - Standalone single-page app with all CSS/JS inline
- Client data persists in browser localStorage

## Features

✅ **Workout Splits** - A/B/ABC/ABCD programs with weekly rotation  
✅ **Exercise Library** - MFIT API integration for exercise videos/images  
✅ **Progress Tracking** - Set tracking, rep/weight logging, rest timer  
✅ **Client Photos** - Upload/edit profile photo (saved to localStorage)  
✅ **Responsive Design** - Mobile-first, works offline after first load  
✅ **Print Support** - Clean workout plan printouts  

## MFIT API Integration

**Endpoint:** `https://app.mfit.com.br/exercise/search`

```javascript
const response = await fetch(
  `https://app.mfit.com.br/exercise/search?q=${encodeURIComponent(exerciseName)}&locale=pt-BR`,
  {
    headers: {
      'Authorization': 'Bearer <token>'
    }
  }
);
const data = await response.json();
const exercise = data.items[0]; // Best match
```

**Returns:**
- `objectID` - Unique ID
- `nome` - Exercise name (PT-BR)
- `url_media` - Video URL
- `url_poster` - Thumbnail image
- `category` - Category (e.g., "Pernas")
- `group` - Muscle group (e.g., "Quadríceps")

**Auth Token:** Stored in page config, expires periodically (requires manual refresh)

## Adding a New Client

1. Copy existing client folder: `cp -r treino/yasmin treino/<new-client>`
2. Edit `index.html`:
   - Update client name in header
   - Update workout split (A/B/ABC/ABCD)
   - Replace exercises with client's program
3. Search MFIT for exercise videos: `GET /exercise/search?q=<name>&locale=pt-BR`
4. Deploy: `git add . && git commit -m "Add <client>" && git push`
5. URL: `https://rpedroni.com.br/rpedroni-labs-pages/treino/<client>/`

## Data Storage

All client data (progress, photos, completed sets) saves to browser localStorage:
- `workoutState_<split>_<week>` - Completed sets/reps/weights
- `clientPhoto` - Base64 JPEG (150x150)
- `completedWorkouts` - Historical completion dates

No server-side storage. Private, GDPR-friendly, works offline.

## Upcoming Features

🔮 **Automated Workout Generation** - AI-assisted program creation based on trainer methodology  
🔮 **WhatsApp Integration** - Send workout reminders/updates via MaxResults business number  
🔮 **Progress Analytics** - Charts, PRs, volume tracking  

---

**Live:** https://rpedroni.com.br/rpedroni-labs-pages/  
**Repo:** https://github.com/rpedroni/rpedroni-labs-pages  
**Contact:** MaxResults (+55 41 99977-5758)
