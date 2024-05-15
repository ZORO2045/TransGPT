const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text"),
  inputChars = document.querySelector("#input-chars"),
  swapBtn = document.querySelector(".swap-position"),
  darkModeCheckbox = document.getElementById("dark-mode-btn"),
  uploadDocument = document.querySelector("#upload-document"),
  downloadBtn = document.querySelector("#download-btn");

function populateDropdown(dropdown, options) {
  const ul = dropdown.querySelector("ul");
  ul.innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = `${option.name} (${option.native})`;
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    ul.appendChild(li);
  });
}

function toggleDropdown(dropdown) {
  dropdown.classList.toggle("active");
}

function switchLanguages() {
  const temp = inputLanguageDropdown.innerHTML;
  inputLanguageDropdown.innerHTML = outputLanguageDropdown.innerHTML;
  outputLanguageDropdown.innerHTML = temp;

  const tempValue = inputLanguageDropdown.dataset.value;
  inputLanguageDropdown.dataset.value = outputLanguageDropdown.dataset.value;
  outputLanguageDropdown.dataset.value = tempValue;

  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
}

function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage = inputLanguageDropdown.dataset.value;
  const outputLanguage = outputLanguageDropdown.dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleInputChange() {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  translate();
  inputChars.innerHTML = inputTextElem.value.length;
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
      translate();
    };
  } else {
    alert("Please upload a valid file");
  }
}

function handleDownload() {
  const outputText = outputTextElem.value;
  const outputLanguage = outputLanguageDropdown.dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    toggleDropdown(dropdown);
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

swapBtn.addEventListener("click", (e) => {
  switchLanguages();
});

darkModeCheckbox.addEventListener("change", () => {
  toggleDarkMode();
});

inputTextElem.addEventListener("input", (e) => {
  handleInputChange();
});

uploadDocument.addEventListener("change", (e) => {
  handleFileUpload(e);
});

downloadBtn.addEventListener("click", (e) => {
  handleDownload();
});
