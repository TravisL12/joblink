const PROTOCOL = 'https://';

class Storage {
  save(text, source) {
    chrome.storage.local.set({ [source]: PROTOCOL + text });
  }

  setDarkMode(val) {
    chrome.storage.local.set({ dark_mode: val });
  }

  getDarkMode() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('dark_mode', items => {
        return resolve(items.dark_mode);
      });
    });
  }

  displayLink() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(function(data) {
        if (data) {
          let links = {};
          for (let link in data) {
            if (!data.hasOwnProperty(link)) {
              continue;
            }
            links[link] = data[link];
          }
          return resolve(links);
        }
      });
    });
  }

  deleteLink(key) {
    chrome.storage.local.remove(key);
  }
}
