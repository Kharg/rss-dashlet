<?php

namespace Espo\Modules\RSS\Controllers;

use Espo\Core\Api\Request;
use Espo\Core\Api\Response;
use Espo\Core\Api\ResponseComposer;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Exceptions\NotFound;

class RssFeed extends \Espo\Core\Controllers\Base
{
    public function getActionFeed($params, $data, $request)
    {
        $url = $request->getQueryParam('url');
        if (!$url) {
            throw new BadRequest('URL is not provided.');
        }

        $xml = file_get_contents($url);
        if ($xml === false) {
            throw new NotFound();
        }

        return $xml;
    }
}