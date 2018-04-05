class Joblink {
  constructor () {
    this.storage = new Storage();
    this.bodyEl = $('body');
    this.bodyContainerEl = $('#body-container');
    this.addLinkBtn = $('.add-link-button');
    this.dropdownMenu = $('#dropdown');

    $('.tab-pane').on('click', '.slider', this.tabPanelListeners.bind(this));
    this.bodyEl.on('click', '.settings-url', this.bodyListeners);
    this.dropdownMenu.change(this.dropdownListener.bind(this));

    this.bodyContainerEl.on('click', '.options', this.deleteListeners);
    this.bodyContainerEl.on('click', '#a-link', this.copyCardListeners);
    this.addLinkBtn.click(this.saveLink.bind(this));

    this.checkDarkMode();
    this.displaySavedLinks();
  }

  buildServiceContainer (links) {
    for(let link in links) {
      if (link !== 'dark_mode') {
        const linkBod = `
          <div id="a-link" class="link-container ${link}-container" href="${links[link]}" data-toggle="tooltip" data-placement="bottom" trigger="click" title="Link copied!">
            <div class="link-placeholder">
              <p><i class="fa fa-${link === 'Portfolio' ? 'briefcase' : link.toLowerCase()} fa-lg" aria-hidden="true"></i> ${link === 'Portfolio' ? 'Portfolio' : link}</p>
              <div id="${link}"class="float-right options">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </div>
            </div>

            <div class="link-bottom-container ${link}-bottom-container">
              <div class="copy-link-placeholder text-center">
                <p>Copy Link</p>
              </div>
            </div>
          </div>`

        this.bodyContainerEl.append(linkBod);
      }
    }
  }

  toggleDarkMode(isDark) {
    $('#dark-mode-slide').prop('checked', isDark);
    $('.list-group-item').toggleClass('dark_mode', isDark);
    this.bodyEl.toggleClass('dark_mode', isDark);
    this.dropdownMenu.toggleClass('dark_mode', isDark);
    $('.nav-link').toggleClass('dark_nav', isDark);
    this.addLinkBtn.toggleClass('dark_button', isDark);
  }

  checkDarkMode () {
    this.storage.getDarkMode().then(this.toggleDarkMode.bind(this));
  }

  tabPanelListeners () {
    this.storage.getDarkMode().then(isDark => {
      this.storage.setDarkMode(!isDark);
      this.toggleDarkMode(!isDark);
    });
  }

  bodyListeners () {
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  }

  displaySavedLinks () {
    this.storage.displayLink().then(links => {
      this.buildServiceContainer(links);
    });
  }

  dropdownListener () {
    const source = this.dropdownMenu.val();
    $('#newLinkItem').find('.chosen-link').text(source);
    $('#newLinkItem').show("fast");
    this.addLinkBtn.removeAttr('disabled');
    this.addLinkBtn.removeClass('disabled_button');
    $('#basic-url').focus();
  }

  saveLink () {
    const source = this.dropdownMenu.val();
    const $linkText = $('#basic-url');

    if(source != 'Add Link: Source') {
      if($linkText.val() != '') {
        this.storage.save($linkText.val(), source);

        $($linkText).val('');
        this.dropdownMenu[0].selectedIndex = 0;
        $('div').remove('#a-link');
        $('#newLinkItem').hide("fast");

        this.storage.displayLink().then(links => {
          this.buildServiceContainer(links);
        });
        this.addLinkBtn.attr('disabled', 'disabled');
        this.addLinkBtn.addClass('disabled_button');
      }
    }
    this.addLinkBtn.attr('disabled', 'disabled');
    this.addLinkBtn.addClass('disabled_button');
  }

  copyCardListeners () {
    $('[data-toggle="tooltip"]').tooltip('dispose');

    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).attr('href')).select();
    document.execCommand("copy");
    $temp.remove();

    $(this).tooltip('toggle');
  }

  deleteListeners (e) {
    this.storage.deleteLink(e.target.parentElement.id);
    $('div').remove('#a-link');

    this.storage.displayLink().then(links => {
      this.buildServiceContainer(links);
    });
  }
}

new Joblink();
