# 🎬 CINEVERSE — Movie Discovery Platform

CINEVERSE is a responsive movie discovery web application designed to make exploring films, managing watchlists, and organizing personal movie preferences simple and enjoyable.

## ✨ Features

- **Movie Discovery:** Browse the movie catalogue and explore available movie information.
- **Search & Filtering:** Find movies by title and use available discovery filters.
- **Movie Details:** View available descriptions, genres, ratings, and cast information.
- **Trailer Experience:** Access the trailer interface where supported.
- **Personal Watchlist:** Save movies for later.
- **Continue Watching:** Store playback progress locally when progress is recorded by the application.
- **Ratings & Reviews:** Enter and manage locally stored movie reviews.
- **Personalized Recommendations:** Display recommendations based on supported local viewing data.
- **User Preferences:** Save a display name, favorite genres, and theme preference.
- **Responsive Layout:** Adapt the interface for desktop, tablet, and mobile screens.
- **Accessibility Improvements:** Keyboard-focus styling, a skip link, and reduced-motion support.
- **Local Persistence:** Use browser local storage for supported features.

> Note: Features depend on the project's actual integration and movie data. Real user accounts, cloud synchronization, and real video playback are not provided by local storage alone.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- Git and GitHub

## 📁 Project Structure

```text
CINEVERSE/
├── index.html
├── style.css
├── script.js
├── reviews.js
├── personalized.js
├── advanced-search.js
├── movie-details.js
├── watchlist.js
├── continue-watching.js
├── user-profile.js
├── accessibility.js
└── README.md
```

The project may contain additional files depending on the original implementation.

## 🚀 Getting Started

### Option 1: Open directly

1. Download or clone the repository.
2. Open the project folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Test the available movie discovery features.

### Option 2: Run with Vite

If the project has a Vite configuration and a `dev` script in `package.json`, run:

```bash
npm install
npm run dev
```

Use the local URL displayed in the terminal.

Do not use the Vite commands if the project does not have the required configuration.

## 🧪 Final Testing Checklist

- [ ] Homepage and movie cards display correctly.
- [ ] Search and filters work.
- [ ] Movie details open and close correctly.
- [ ] Trailer modal works with valid trailer sources.
- [ ] Watchlist additions and removals persist after refresh.
- [ ] Reviews save and render correctly.
- [ ] Recommendation sections display valid movies.
- [ ] Continue Watching updates when progress is recorded.
- [ ] Profile preferences persist after refresh.
- [ ] Theme selection matches the interface.
- [ ] Mobile layout works without horizontal overflow.
- [ ] Keyboard navigation and focus indicators work.
- [ ] Browser console has no uncaught JavaScript errors.

## 💾 Data and Privacy

Features that use `localStorage` save information in the current browser. Clearing browser storage may erase that information. Local data is not automatically backed up or synchronized across devices.

## 🔮 Future Improvements

- Backend API and database integration
- Secure user authentication
- Cloud-synchronized watchlists
- Verified live movie metadata and trailer sources
- Real playback progress tracking
- More advanced recommendation algorithms
- Automated testing and continuous integration

## 👨‍💻 Development

This project is intended as a learning and portfolio project. Review, test, and customize the source code before deploying it publicly.

## 📄 License

Choose and add an appropriate license before distributing the project.
