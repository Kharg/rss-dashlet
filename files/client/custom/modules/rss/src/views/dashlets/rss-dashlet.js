define('rss:views/dashlets/rss-dashlet', ['views/dashlets/abstract/base'], function (Dep) {

    return Dep.extend({
  
        name: 'RSS',
  
        template: 'rss:dashlets/rss-dashlet',
  
        setup: function () {
            Dep.prototype.setup.call(this);
            this.feedData = [];
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
            let dateFormat = this.getConfig().get('dateFormat');
            let timeFormat = this.getConfig().get('timeFormat');
            const options = {
                dataType: 'text'
            };
  
            Espo.Ajax.getRequest('RssFeed/action/Feed', {url: this.feedUrl}, options)
                .then(response => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response, "text/xml");
                    const items = xmlDoc.querySelectorAll("item");
                    const feedData = Array.from(items).map(item => {
                        const pubDate = item.querySelector("pubDate").textContent;
                        const formattedPubDate = moment(pubDate).format(dateFormat + ', ' + timeFormat);
                        const description = this.extractCdataContent(item.querySelector("description")) || this.extractCdataContent(item.querySelector("content")) || '';
                        return {
                            title: item.querySelector("title").textContent,
                            link: item.querySelector("link").textContent,
                            pubDate: formattedPubDate,
                            preview: description
                        };
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
                feedData: this.feedData
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