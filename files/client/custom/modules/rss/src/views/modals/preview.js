define('rss:views/modals/preview', 'views/modal', function (Dep) {

    return Dep.extend({

        template: 'rss:modals/preview',
        fitHeight: true,
        isCollapsable: true,

        data: function () {
            return {
                url: this.options.url
            };
        },

        setup: function () {
            this.buttonList = [
                {
                    name: 'close',
                    label: 'Close',
                },
            ];

            let title = this.options.title || '';
            this.headerText = title;
        },

    });
});