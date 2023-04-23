<div class="list-container">
    <div class="list list-expanded">
        {{#if feedData}}
            <ul class="list-group">
                {{#each feedData}}
                    <li class="list-group-item list-row">
                        <a href="{{link}}" target="_blank" class="text-primary">{{title}}</a>
                        {{#if ../includeArticleDescription}}
                            <div class="text-muted">{{{preview}}}</div>
                        {{/if}}
                        <div class="text-muted small">{{pubDate}}</div>
                    </li>
                {{/each}}
            </ul>
        {{else}}
            <div class="alert alert-warning" style="text-align: center;">{{translate 'No feed data available.'}}</div>
        {{/if}}
    </div>
</div>