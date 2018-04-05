class Joblink {
  constructor () {
    this.storage = new Storage();
    this.bodyEl = $('body');
    this.bodyContainerEl = $('#body-container');
    this.addLinkBtn = $('.add-link-button');
    this.dropdownMenu = $('#dropdown');

    $('.tab-pane').on('click', '.slider', this.tabPanelListeners);
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

  checkDarkMode () {
    this.storage.getDarkMode().then(item => {
      if (item) {
        $('#dark-mode-slide').prop('checked', true);
        $('.list-group-item').addClass('dark_mode');
        this.bodyEl.addClass('dark_mode');
        this.dropdownMenu.addClass('dark_mode');
        $('.nav-link').addClass('dark_nav');
        this.addLinkBtn.addClass('dark_button');
      };
    });
  }

  tabPanelListeners () {
    this.storage.getDarkMode().then(item => {
      if (item) {
        this.storage.setDarkMode(false);
        $('#dark-mode-slide').prop('unchecked', true);
        $('.list-group-item').removeClass('dark_mode');
        this.bodyEl.removeClass('dark_mode');
        this.dropdownMenu.removeClass('dark_mode');
        $('.nav-link').removeClass('dark_nav');
        this.addLinkBtn.removeClass('dark_button');
      } else {
        this.storage.setDarkMode(true);
        $('#dark-mode-slide').prop('checked', true);
        $('.list-group-item').addClass('dark_mode');
        this.bodyEl.addClass('dark_mode');
        this.dropdownMenu.addClass('dark_mode');
        $('.nav-link').addClass('dark_nav');
        this.addLinkBtn.addClass('dark_button');
      }
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
