window.addEventListener('load', () => {

  /*
   * Load Cats
   */
  getNewCat();

   /*
   * SW
   */
  if (!('serviceWorker' in navigator)) {
    // service workers not supported 😣
    return;
  }

  navigator.serviceWorker.register('sw.js').then(
    async () => {
      console.log('Service Worker registered! 👍🏼');
    },
    err => {
      console.error('SW registration failed! 😱', err)
    }
  );
});

getNewCat = () => {
  document.querySelector("label").style.display = "block";
  fetch('https://api.thecatapi.com/v1/images/search?size=full')
  .then( async (data) => {
    const result = await data.json();
    if(result[0]["url"] === "offline") {
      document.querySelector(".offline").style.display = "block";
    } else {
      document.querySelector(".offline").style.display = "none";
      document.querySelector(".cat-box").setAttribute('src', result[0]["url"]);
      document.querySelector("label").style.display = "none";
    }
  });
}