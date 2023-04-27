define('rss:views/dashlets/rss-dashlet', ['views/dashlets/abstract/base'], function (Dep) {

    return Dep.extend({
  
      name: 'RSS',
  
      template: 'rss:dashlets/rss-dashlet',
  
      events: {
        'click .rss-link': 'handleRssLinkClick'
      },
  
      setup: function () {
        Dep.prototype.setup.call(this);
        this.feedData = [];
        this.includeArticleDescription = this.getOption("includeArticleDescription");
        this.includeArticleTime = this.getOption("includeArticleTime");
        this.timeSeparator = this.getOption("timeSeparator");
        this.dateFormat = this.getOption("dateFormat");
        this.timeFormat = this.getOption("timeFormat");
        this.dateTimeOption = this.getOption("dateTimeOption");
        this.momentDateTimeFormat = this.getOption("momentDateTimeFormat");
        this.showArticleInModal = this.getOption("showArticleInModal");
        this.displayRecords = this.getOption("displayRecords");
        this.sortDirection = this.getOption("sortDirection");
        if (this.getOption("feed")) {
          this.loadFeed(true);
        }
      },
  
      extractCdataContent: function (element) {
        if (element && element.childNodes.length > 0) {
          const cdata = element.childNodes[0];
          if (cdata.nodeType === Node.CDATA_SECTION_NODE) {
            return cdata.textContent;
          } else {
            return element.textContent;
          }
        }
        return '';
      },

      replaceHttpWithHttps: function (url) {
        if (url && url.startsWith('http://')) {
          return url.replace('http://', 'https://');
        }
        return url;
      },
  
      loadFeed: function (initialLoad) {
        this.feedUrl = this.getOption("feed");
        const dateFormat = this.dateFormat === "System" ? this.getConfig().get('dateFormat') : this.dateFormat;
        const timeFormat = this.timeFormat === "System" ? this.getConfig().get('timeFormat') : this.timeFormat;
  
        if (this.dateTimeOption === "Dashlet") {
          var completeDateFormat = dateFormat + this.timeSeparator + timeFormat;
        } else {
          var completeDateFormat = this.momentDateTimeFormat ? this.momentDateTimeFormat : dateFormat + this.timeSeparator + timeFormat;
        }
  
        const options = {
          dataType: 'text'
        };
  
        Espo.Ajax.postRequest('RssFeed/action/Feed', {
            url: this.feedUrl,
            }, options)
        .then(response => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            let feedData = Array.from(items).map(item => ({
                title: item.querySelector("title")?.textContent ?? null,
                link: this.replaceHttpWithHttps(item.querySelector("link")?.textContent ?? null),
                pubDateRaw: item.querySelector("pubDate")?.textContent,
                preview: this.extractCdataContent(item.querySelector("description") || item.querySelector("content")) ?? '',
            }));

            feedData = feedData.slice(0, this.displayRecords);

            feedData.sort((a, b) => {
                if (this.sortDirection === 'asc') {
                    return new Date(a.pubDateRaw) - new Date(b.pubDateRaw);
                } else {
                    return new Date(b.pubDateRaw) - new Date(a.pubDateRaw);
                }
            });
            
            feedData.forEach(article => {
                article.pubDate = article.pubDateRaw ? moment(article.pubDateRaw).format(completeDateFormat) : null;
            });

            this.feedData = feedData;
            if (initialLoad) {
                this.render();
            }
        })
        .catch(xhr => {
            console.error('Error fetching RSS feed:', xhr);
        });
    },
  
      data: function () {
        return {
          feedData: this.feedData,
          includeArticleDescription: this.includeArticleDescription,
          showArticleInModal: this.showArticleInModal,
          includeArticleTime: this.includeArticleTime,
        };
      },
  
      afterRender: function () {
        Dep.prototype.afterRender.call(this);
        if (this.getOption("feed")) {
          this.loadFeed(false);
        }
      },
  
      handleRssLinkClick: function (event) {
        if (this.showArticleInModal) {
          event.preventDefault();
          const targetLink = event.target.href;
          const targetTitle = event.target.textContent;
          this.actionOpenPreview(targetLink, targetTitle);
        }
      },
  
      actionOpenPreview: function (targetLink, targetTitle) {
        this.createView('dialog', 'rss:views/modals/preview', {
          url: targetLink,
          title: targetTitle
        }, function (view) {
          view.render();
        }, this);
      },
  
      afterAdding: function () {
        this.getParentView().actionOptions();
      },
  
    });
  });