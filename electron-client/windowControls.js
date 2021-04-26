const remote = require("electron").remote;

document.querySelector(".closeBtn").addEventListener("click",
	remote.getCurrentWindow().close
);

document.querySelector(".maxBtn").addEventListener("click", event => {
  let myVar1 = remote.getCurrentWindow();
	console.log(myVar1);
  if (myVar1.isMaximized()) {
    document.body.classList.remove("maximized");
    myVar1.maximize();
  }
  else {
    document.body.classList.add("maximized");
    myVar1.unmaximize();
  }
});

document.querySelector(".minBtn").addEventListener("click",
	remote.getCurrentWindow().minimize
);

const MaxMinWindow = () => {
  let myVar1 = remote.getCurrentWindow();
	console.log(myVar1);
  if (myVar1.isMaximized()) {
    document.body.classList.remove("maximized");
    myVar1.maximize();
  }
  else {
    document.body.classList.add("maximized");
    myVar1.unmaximize();
  }
};

const MinWindow = remote.getCurrentWindow().minimize;