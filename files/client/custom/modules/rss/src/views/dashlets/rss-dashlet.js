define('rss:views/dashlets/rss-dashlet', ['views/dashlets/abstract/base'], function (Dep) {

    return Dep.extend({
  
        name: 'RSS',
  
        template: 'rss:dashlets/rss-dashlet',
  
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
  
            Espo.Ajax.getRequest('RssFeed/action/Feed', {url: this.feedUrl}, options)
                .then(response => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response, "text/xml");
                    const items = xmlDoc.querySelectorAll("item");
                    const feedData = Array.from(items).map(item => ({
                        title: item.querySelector("title")?.textContent ?? null,
                        link: item.querySelector("link")?.textContent ?? null,
                        pubDate: item.querySelector("pubDate")?.textContent ? moment(item.querySelector("pubDate").textContent).format(completeDateFormat) : null,
                        preview: this.extractCdataContent(item.querySelector("description") || item.querySelector("content")) ?? '',
                      }));
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
                includeArticleTime: this.includeArticleTime,
            };
        },
  
        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            if (this.getOption("feed")) {
              this.loadFeed(false);
            }
        },
  
        afterAdding: function () {
            this.getParentView().actionOptions();
        },
  
    });
  });