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
    public function postActionFeed($params, $data, $request)
    {
        $url = $request->getParsedBody()->url;
        if (!$url) {
            throw new BadRequest('URL is not provided.');
        }

        $xml = file_get_contents($url);
        if ($xml === false) {
            throw new NotFound();
        }
        $xml = mb_convert_encoding($xml, 'UTF-8', mb_detect_encoding($xml, 'UTF-8, ISO-8859-1', true));
        return $xml;
    }
}