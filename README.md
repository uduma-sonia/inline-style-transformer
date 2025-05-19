A Node.js script that converts inline JavaScript style objects — including shorthand properties and responsive breakpoints — into static CSS files.

---

- Expands shorthand properties like `mx`, `py`, `bg`
- Supports responsive breakpoints (`xs`, `sm`, `md`, `lg`, `xl`)
- Handles pseudo selectors like `:hover`, `:focus`

---

## 📦 Installation

`git clone https://github.com/uduma-sonia/inline-style-transformer.git`

`cd inline-style-transformer`

`npm install`

## Run Script

1. Define your styles in `inlineStyles.js`.
2. In your terminal (from the project root), run: `node index.js`
3. Check the generated CSS in `outputStyles.css`
