# CryptoTracker App

This is a mobile-first, responsive web application built with React.js, Vite, Redux Toolkit, and Tailwind CSS to track cryptocurrency prices and perform conversions.

## Architecture Choice and Reasoning

### Frontend (React.js with Vite)
* **React.js:** Chosen for its component-based architecture, which promotes reusability, maintainability, and a clear separation of concerns. It's ideal for building Single Page Applications (SPAs) due to its efficient DOM updates and declarative UI.
* **Vite:** Selected as the build tool for its incredibly fast development server and optimized build process. It offers a superior developer experience compared to traditional bundlers like Webpack for typical React projects.
* **Redux Toolkit:** Used for state management. It provides a robust, scalable, and predictable state container for larger applications with complex data flows, simplifying common Redux patterns and reducing boilerplate. It manages cryptocurrency listings, conversion results, and loading/error states.
* **Tailwind CSS:** A utility-first CSS framework chosen for rapid UI development and consistent styling. Its class-based approach allows for highly customizable designs directly in the JSX, minimizing context switching and promoting responsive design with its built-in utility classes.
* **React Router:** For declarative routing within the SPA, enabling seamless navigation between different views (Homepage, Converter) without full page reloads.
* **Axios:** A promise-based HTTP client used for making API requests to the CoinMarketCap API. It offers a more convenient and feature-rich interface for handling HTTP requests than the native `fetch` API, including automatic JSON parsing and better error handling.
* **`react-hot-toast`:** Integrated for displaying non-intrusive, user-friendly notifications (success, error, validation messages) instead of disruptive browser `alert()` pop-ups, enhancing the overall user experience.
* **Lazy Loading (`React.lazy` and `Suspense`):** Implemented for route-based components (`HomePage`, `CryptoConverter`) to enable code splitting. This defers the loading of JavaScript bundles for specific pages until they are actually needed, significantly improving the application's initial load performance.
* **`React.memo`:** Applied to components like `CryptoConverter` and `CryptoCard` to prevent unnecessary re-renders when their props haven't shallowly changed, contributing to overall rendering performance optimization.

### Backend (Not Implemented in this Version)
For this initial version, a dedicated Node.js/Express.js backend is not implemented. All CoinMarketCap API calls are made directly from the frontend.

**Rationale for no backend:**
* **Simplicity & Rapid Deployment:** Avoiding a backend simplifies the project setup, development, and deployment process to a single static hosting environment.
* **Public Data:** The CoinMarketCap API provides public data, so there's no immediate need to proxy requests to hide sensitive information (though API keys are handled securely via environment variables during development/build).
* **Meeting Core Requirements:** The primary requirements (tracking and conversion) can be fully met client-side without a server-side component.

Should future requirements include hiding API keys more rigorously, implementing custom business logic, or integrating with databases, an Express.js backend would be the logical next step.

## Folder Structure

The project is organized into `frontend` and `documentation` directories for clear separation.

* `frontend/`: Contains all React application code, assets, and configuration.
    * `public/`: Static assets served directly (e.g., `index.html`, `vite.svg`).
    * `src/`: Main application source code.
        * `assets/`: Images, icons, and other static media (e.g., `placeholder-logo.png`).
        * `components/`: Reusable UI components (`CryptoCard`, `Loading`, `ErrorMessage`).
        * `pages/`: Top-level components representing distinct views/pages (`HomePage`, `CryptoConverter`).
        * `redux/`: Redux store configuration and slices (`store.js`, `cryptoSlice.js`).
        * `services/`: Centralized API interaction logic (`cryptoApi.js`).
        * `utils/`: Helper functions and utilities (`format.js` for formatting, `helpers.js` for other utilities).
        * `App.jsx`: Main application component, handles routing and global setup.
        * `index.css`: Global styles and Tailwind CSS imports.
        * `main.jsx`: Entry point for React application.
    * `.env.example`: Template for environment variables.
    * `package.json`: Project dependencies and scripts.
    * `postcss.config.js`: PostCSS configuration for Tailwind.
    * `tailwind.config.js`: Tailwind CSS configuration.
    * `vite.config.js`: Vite build tool configuration.

* `documentation/`: Contains project-related documentation files.