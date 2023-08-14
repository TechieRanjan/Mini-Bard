window.addEventListener('load', () => {
  registerSW();
});



async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}


const sendButton = document.getElementById("sendButton");
const inputText = document.getElementById("inputText");
let mainContainer = document.querySelector('section')
const hiddenBtn = document.getElementById("hiddenBtn");
const form = document.getElementById("form");
const resultImg = document.getElementById("resultImg");
const receive = new Audio("/images/got.wav");
const spans = document.querySelectorAll("#spansTry");
let answers = document.querySelectorAll(".answer");
let intro = document.getElementById("intro");

let QuestiosBox = [];
function appendQuestion(question) {
  let div = document.createElement("div");
  div.className = "answer_box";
  div.style.background = "transparent";
  let i = document.createElement("i");
  i.className = "material-icons";
  i.textContent = "account_circle";
  let span = document.createElement("span");
  span.textContent = question;
  div.append(i);
  div.append(span);
  div.style.borderRadius = "25px";
  mainContainer.appendChild(div);
  // scrollToBottom(); 
  QuestiosBox.push(div);
   div.scrollIntoView({ behavior: "smooth" });
  
  if (intro) {
    intro.style.display = "none";
  }
}

let preLoaderBoxes = [];
let loaderImages = [];
let copyTexts = [];

function appendPreLoader() {
  let div = document.createElement("div");
  let loaderBox = document.createElement("div");
  let img = document.createElement("img");
  let blankdiv = document.createElement("div");
  div.className = "answer_box";
  img.id = "loader";
  img.src = "/images/ai.gif";
  loaderBox.append(img);
  div.append(loaderBox);
  div.append(blankdiv);
  mainContainer.append(div);
  preLoaderBoxes.push(blankdiv);
  loaderImages.push(img);
  scrollToBottom(); 
   div.scrollIntoView({ behavior: "smooth" });
}

function appendAnswer(ans, ss, ImageSRC, info, related, allImgs) {
  receive.play();
  let source = document.createElement("div");

  let answer = document.createElement("p");
  let sourceText = document.createElement("p");
  let tools = document.createElement("div");
  let imgs = document.createElement("div");
  let img = document.createElement("img");
  let copy = document.createElement("i");
  let share = document.createElement("i");
  let blankdiv = document.createElement("div");
  let aSource = document.createElement("a");
  sourceText.textContent = "Source";
  copy.className = "material-icons";
  share.className = "material-icons";
  copy.textContent = "content_copy";
  // share.textContent = "share";
  imgs.className = "imgs";
  img.src = "https://duckduckgo.com/" + ImageSRC;
  answer.className = "answer";
  tools.className = "tools";

  source.className = "source";
  answer.textContent =
    ans ||
    "Data not found 🥵\nThis Bot answer only question that have topic\n Try asking some other question";
  aSource.href = ss;

  aSource.textContent = "Wekipedia";
  source.append(sourceText);
  source.append(aSource);
  imgs.append(img);

  if (ans && ans !== "Network Error") {
    tools.append(copy);
  }
  blankdiv.append(answer);
  if (ss) {
    blankdiv.append(source);
  }
  blankdiv.append(tools);
  if (ImageSRC) {
    blankdiv.append(imgs);
  }
  if (info) {
    blankdiv.append(makeTable(info));
  }
  if (allImgs) {
    blankdiv.append(makeMoreImages(allImgs));
  }
  if (related && related.length) {
    blankdiv.append(makeLinks(related));
  }
  answers = document.querySelectorAll(".answer");
  copy.addEventListener("click", handleCopy);
  blankdiv.classList.add("animate-fadeIn");
  preLoaderBoxes[getLastElemnt(preLoaderBoxes)].append(blankdiv);
  loaderImages[getLastElemnt(loaderImages)].src = "images/bard.gif";

  let elem = QuestiosBox[getLastElemnt(QuestiosBox)];
  elem.scrollIntoView({ behavior: "smooth" });

  elem.style.marginTop = "20px";
}

function makeTable(data) {
  let table = document.createElement("table");
  let tr = document.createElement("tr");
  let th1 = document.createElement("th");
  let th2 = document.createElement("th");
  th1.textContent = "Name";
  th2.textContent = "Value";
  tr.append(th1);
  tr.append(th2);
  table.append(tr);
  data.forEach((result) => {
    if (result.data_type.includes("string")) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      td2.textContent = result.value;
      td1.textContent = result.label;
      tr.append(td1);
      tr.append(td2);
      table.append(tr);
    }
  });
  return table;
}

function makeLinks(data) {
  let links = document.createElement("div");
  let h1 = document.createElement("h4");
  links.appendChild(h1);
  h1.textContent = "More Results form search";
  links.className = "links";
  data.forEach((link) => {
    if (link.Text && link.Result) {
      let link1 = document.createElement("div");
      link1.className = "link";
      link1.innerHTML = link.Result;
      let p = document.createElement("p");
      p.textContent = get20Words(link.Text);

      link1.append(p);
      links.append(link1);
    }
  });
  return links;
}

function makeMoreImages(data) {
  let div = document.createElement("div");
  div.className = "moreImg";
  data.forEach((srcs) => {
    let img = document.createElement("img");
    img.setAttribute("loading", "eager");
    img.src = srcs.largeImageURL;
    div.append(img);
  });
  // mainContainer.append(div)
  return div;
}

function getLastElemnt(ele) {
  let val = ele.length == 0 ? ele.length : ele.length - 1;
  return val;
}

function handleCopy(e) {
  let slecter = e.target.parentNode.parentNode;
  let answer = slecter.querySelector(".answer");
  navigator.clipboard.writeText(answer.textContent);
  e.target.textContent = "check";
  setTimeout(() => {
    e.target.textContent = "content_copy";
  }, 3000);
}

sendButton.addEventListener("click", () => {
  hiddenBtn.click();
});

inputText.addEventListener("input", () => {
  if (inputText.value) {
    toggleClass(true);
  } else {
    toggleClass(false);
  }
});

function toggleClass(isTrue) {
  if (isTrue) {
    sendButton.classList.add("enable");
  } else {
    sendButton.classList.remove("enable");
  }
}

form.addEventListener("submit", (e) => {
  inputText.blur()
  e.preventDefault();
  appendQuestion(inputText.value);
  appendPreLoader();
  sendQuestion(inputText.value);
  inputText.value = null;
  toggleClass(false);
});


function sendQuestion(ee) {
  const formData = new FormData(form);
  const params = new URLSearchParams(formData);
  fetch("/answer", {
    method: "post",
    body: params,
  })
    .then((response) => {
      if (!response.ok) {
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.answer.Abstract);

      appendAnswer(
        data.answer.Abstract,
        data.answer.AbstractURL,
        data.answer.Image,
        data.answer.Infobox.content,
        data.answer.RelatedTopics,
        data.images.hits
      );
    })
    .catch((error) => {
      console.log(error);
      appendAnswer("Network Error");
    });
}

function appendInit(data) {
  if (data.Image) {
    appendImage(data.Image);
  }
  if (data.AbstractURL) {
    sourceText1.textContent = "Source";
    source1.href = data.AbstractURL;
    source1.textContent = data.AbstractURL;
  }
}

function appendImage(link) {
  let div = document.createElement("div");
  div.className = "imgs";
  let img = document.createElement("img");
  img.src = "https://duckduckgo.com/" + link;
  div.append(img);
  mainContainer.append(div);
}

function scrollToBottom() {
  mainContainer.scrollTop = mainContainer.scrollHeight;
}

function hideAnswerCursor() {
  setTimeout(() => {
    mainanswer.classList.add("hidden");
  }, 3000);
}

function showAnswerCursor() {
  mainanswer.classList.remove("hidden");
}

spans.forEach((span) => {
  span.addEventListener("click", () => {
    inputText.value = span.innerHTML;
    hiddenBtn.click();
  });
});

function get20Words(text) {
  if (!text) return;
  const words = text.split(" ");
  const first20Words = words.slice(0, 20);
  const result = first20Words.join(" ");
  return result + "...";
}
