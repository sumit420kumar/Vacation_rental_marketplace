let taxSwitch = document.getElementById('switchCheckDefault');
taxSwitch.addEventListener('click', () => {
  let taxInfo = document.querySelectorAll('.tax-info');
  for (info of taxInfo) {
    // if (taxSwitch.checked) {
    //     info.style.display = "inline";
    // } else {
    //     info.style.display = "none";
    // }

    //OR Both are same 
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});