const documents = [
  ["Astronomy-LR.pdf", "Astronomy", "pdf", "39.7 MB"],
  ["small create 1.0.0.mrpack.pdf", "Small Create 1.0.0", "pdf", "3.9 MB"],
  ["Rocket Manual for Amateurs (Bertrand R. Brinley) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Rocket Manual for Amateurs", "pdf", "15.7 MB"],
  ["Astrophysics for People in a Hurry - Summarized for Busy People Based on the Book by Neil De Grasse Tyson (Neil De Grasse Tyson) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astrophysics for People in a Hurry", "pdf", "797 KB"],
  ["Astronomy and Astrophysics in the New Millennium (Astronomy and Astrophysics Survey Committee etc.) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astronomy & Astrophysics in the New Millennium", "pdf", "6.1 MB"],
  ["Astronomy (BarCharts, Inc.) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astronomy Quick Study", "pdf", "857 KB"],
  ["Astrophysics_and_cosmology_-_Roger_Muncaster.pdf", "Astrophysics and Cosmology", "pdf", "59.9 MB"],
  ["Philips Atlas of the Universe (Patrick Moore) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Philips Atlas of the Universe", "pdf", "52.6 MB"],
  ["Astronomy 101  from the sun and moon to wormholes and warp drive, key theories, discoveries, and facts about the universe (Petersen, Carolyn Collins, author) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astronomy 101", "pdf", "12.2 MB"],
  ["blackholes-171207181721.pdf", "Black Holes", "pdf", "3.0 MB"],
  ["The Astronomy Book (DK) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "The Astronomy Book", "pdf", "83.9 MB"],
  ["Astronomy.docx", "Astronomy Notes", "docx", "513 KB"],
  ["Astronomy (Ian Ridpath etc.) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astronomy — Ian Ridpath", "pdf", "99.8 MB"],
  ["Introduction to Rocket Science and Engineering, Second Edition (Travis S. Taylor) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Introduction to Rocket Science & Engineering", "pdf", "76.4 MB"],
  ["Astronomy (Ian Ridpath etc.) (z-library.sk, 1lib.sk, z-lib.sk) (1).pdf", "Astronomy — Ian Ridpath (Copy)", "pdf", "99.8 MB"],
  ["FoA-EngC.pdf", "Fundamentals of Astronomy", "pdf", "39.7 MB"],
  ["Slideshow.pdf", "Astronomy Slideshow", "pdf", "3.0 MB"],
  ["An_Introduction_to_Nuclear_Astrophysics_-_Richard_N_Boyd.pdf", "An Introduction to Nuclear Astrophysics", "pdf", "19.7 MB"],
  ["Astrophysics_for_Physicists_-_Arnab_Rai_Chaudhiri.pdf", "Astrophysics for Physicists", "pdf", "4.6 MB"],
  ["Astronomy - May 2021 (Astronomy) (z-library.sk, 1lib.sk, z-lib.sk).pdf", "Astronomy Magazine — May 2021", "pdf", "34.8 MB"],
  ["Simulations.docx", "Astronomy Simulations", "docx", "12 KB"],
  ["Astrophysics_For_Dummies_-_Cynthia_Phillips_Shana_Priwer.pdf", "Astrophysics for Dummies", "pdf", "42.2 MB"],
  ["Astronomy 101 (Carolyn Collins Petersen) (z-library.sk, 1lib.sk, z-lib.sk).epub", "Astronomy 101 — EPUB Edition", "epub", "2.4 MB"],
  ["How_It_Works_-_Understanding_Astrophysics_3rd_Edition_2025_-_How_It_Works.pdf", "Understanding Astrophysics — 3rd Edition", "pdf", "95.7 MB"],
  ["Astrophysics_for_Physicists_-_Arnab_Rai_Chaudhiri.pdf", "Astrophysics for Physicists", "pdf", "4.6 MB"]
];

// Remove accidental duplicates while keeping the archive order stable.
const library = documents.filter((doc, index, all) =>
  all.findIndex(item => item[0] === doc[0]) === index
);

const grid = document.querySelector("#documentGrid");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const reader = document.querySelector("#reader");
const pdfFrame = document.querySelector("#pdfFrame");
const readerTitle = document.querySelector("#readerTitle");
const readerDownload = document.querySelector("#readerDownload");
const readerOpen = document.querySelector("#readerOpen");
let currentFilter = "all";

function fileUrl(filename) {
  return encodeURI(filename).replaceAll("#", "%23");
}

function updateCounts() {
  const counts = library.reduce((acc, doc) => {
    acc[doc[2]] = (acc[doc[2]] || 0) + 1;
    return acc;
  }, {});
  document.querySelector("#headerCount").textContent = `${library.length} OBJECTS CATALOGUED`;
  document.querySelector("#allCount").textContent = library.length;
  document.querySelector("#pdfCount").textContent = counts.pdf || 0;
  document.querySelector("#docxCount").textContent = counts.docx || 0;
  document.querySelector("#epubCount").textContent = counts.epub || 0;
}

function render() {
  const term = searchInput.value.trim().toLowerCase();
  const visible = library.filter(doc =>
    (currentFilter === "all" || doc[2] === currentFilter) &&
    `${doc[0]} ${doc[1]} ${doc[2]}`.toLowerCase().includes(term)
  );

  grid.innerHTML = "";
  visible.forEach(([filename, title, type, size]) => {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.type = type;
    const description = type === "pdf" ? "Portable document · inline view" : `${type} document · download`;
    const action = type === "pdf"
      ? `<button class="view-button" type="button">OPEN TRANSMISSION</button><span class="arrow">→</span>`
      : `<a href="${fileUrl(filename)}" download>DOWNLOAD FILE</a><span class="arrow">↓</span>`;

    article.innerHTML = `
      <div class="card-top">
        <span class="file-chip">${type.toUpperCase()}</span>
        <span class="file-size">${size}</span>
      </div>
      <h3></h3>
      <p>${description}</p>
      <div class="card-action">${action}</div>
    `;
    article.querySelector("h3").textContent = title;
    if (type === "pdf") {
      const open = () => openReader(filename, title);
      article.querySelector(".view-button").addEventListener("click", open);
      article.addEventListener("dblclick", open);
    }
    grid.appendChild(article);
  });

  resultCount.textContent = `Showing ${visible.length} transmission${visible.length === 1 ? "" : "s"}`;
  emptyState.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
}

function openReader(filename, title) {
  const url = fileUrl(filename);
  readerTitle.textContent = title;
  readerDownload.href = url;
  readerOpen.href = url;
  pdfFrame.src = `${url}#view=FitH`;
  reader.hidden = false;
  document.body.classList.add("reader-open");
  document.querySelector(".close-button").focus();
}

function closeReader() {
  reader.hidden = true;
  pdfFrame.src = "about:blank";
  document.body.classList.remove("reader-open");
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

document.querySelectorAll("[data-close-reader]").forEach(element =>
  element.addEventListener("click", closeReader)
);
searchInput.addEventListener("input", render);
document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && !reader.hidden) closeReader();
});

updateCounts();
render();
