<div class="list-container">
    <div class="list list-expanded">
        {{#if feedData}}
            <ul class="list-group">
                {{#each feedData}}
                    <li class="list-group-item list-row">
                        <a href="{{link}}" {{#unless ../showArticleInModal}}target="_blank"{{/unless}} class="text-primary rss-link">{{title}}</a>
                        {{#if ../includeArticleDescription}}
                            <div class="text-muted">{{{preview}}}</div>
                        {{/if}}
                        {{#if ../includeArticleTime}}
                        <div class="text-muted small">{{pubDate}}</div>
                        {{/if}}
                    </li>
                {{/each}}
            </ul>
        {{else}}
            <div class="alert alert-warning" style="text-align: center;">{{translate 'No feed data available.'}}</div>
        {{/if}}
    </div>
</div>