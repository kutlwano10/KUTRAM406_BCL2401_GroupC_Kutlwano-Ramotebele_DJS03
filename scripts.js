import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1;
let matches = books;

const getHtml = {
    dataListItems : document.querySelector("[data-list-items]"),
    searchGenre : document.querySelector("[data-search-genres]"),
    listButton : document.querySelector("[data-list-button]"),
    cancelSearchButton : document.querySelector("[data-search-cancel]"),
    searchOverlay : document.querySelector("[data-search-overlay]"),
    settingOverlay : document.querySelector("[data-settings-overlay]"),
    cancelSettingButton : document.querySelector("[data-settings-cancel]"),
    headerSearchButton : document.querySelector("[data-header-search]"),
    headerSettingButton : document.querySelector("[data-header-settings]"),
    closePreviousButton : document.querySelector("[data-list-close]"),
    bookPreview: document.querySelector("[data-list-active]")
}

//ADDS THE BOOKS IN HTML & DISPLAY THEM
const initializeBooks = () => {
  const starting = document.createDocumentFragment(); //it allows multiple inserts at the same time on the DOM
  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    starting.appendChild(element);
  }
  getHtml.dataListItems.appendChild(starting);
};


//Books by Genre
const displayBooksByGenre = () => {
  const genreHtml = document.createDocumentFragment();//it doesnt have a child but it exist
  const firstGenreElement = document.createElement("option");
  firstGenreElement.value = "any";
  firstGenreElement.innerText = "All Genres";
  genreHtml.appendChild(firstGenreElement);

  for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
  }

  getHtml.searchGenre.appendChild(genreHtml);
};

//Books by Author
const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}

document.querySelector("[data-search-authors]").appendChild(authorsHtml);


//THEME CHANGE
const changeThemes = () => {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.querySelector("[data-settings-theme]").value = "night";
        document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
        document.documentElement.style.setProperty("--color-light", "10, 10, 20");
      } else {
        document.querySelector("[data-settings-theme]").value = "day";
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
        document.documentElement.style.setProperty("--color-light", "255, 255, 255");
      }

}


const initializeMoreBooksButton = () => {
    getHtml.listButton.innerText = `Show more (${
        books.length - BOOKS_PER_PAGE
      })`;//show more button
      
      getHtml.listButton.disabled =
        matches.length - page * BOOKS_PER_PAGE > 0;
      
      getHtml.listButton.innerHTML = `
          <span>Show more</span>
          <span class="list__remaining"> (${
            matches.length - page * BOOKS_PER_PAGE > 0
              ? matches.length - page * BOOKS_PER_PAGE
              : 0
          })</span>
      `;
}

//
const cancelSearchOverlay =()=> {
    getHtml.searchOverlay.open = false;//CLOSE

}
const calcelSettingOverlay = () => {
    getHtml.settingOverlay.open = false;//CLOSE
}
const openSearchOverlay = () => {
    getHtml.searchOverlay.open = true;//OPEN
    document.querySelector("[data-search-title]").focus();

}
const openSettingOverlay = () => {
    getHtml.settingOverlay.open = true;

}
const closeBookPrevious = () => {
    getHtml.bookPreview.open = false;
}

//ALL CLICKED BUTTONS
const EventListeners =()=> {
    getHtml.cancelSearchButton.addEventListener('click', cancelSearchOverlay)
    getHtml.cancelSettingButton.addEventListener('click', calcelSettingOverlay)
    getHtml.headerSearchButton.addEventListener('click', openSearchOverlay)
    getHtml.headerSettingButton.addEventListener('click', openSettingOverlay)
    getHtml.closePreviousButton.addEventListener('click', closeBookPrevious)
}


document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }

    document.querySelector("[data-settings-overlay]").open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);

      element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

      newItems.appendChild(element);
    }

    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

  //When button clicked
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
});

document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }

    if (active) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });

  const main = () => {
    initializeBooks();
    initializeMoreBooksButton();
    EventListeners()
  }
  main()
