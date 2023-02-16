#!/usr/bin/env php
<?php

const APP_PATH    = __DIR__;
const VIEW_PATH   = APP_PATH.'/views/';
const PUBLIC_PATH = APP_PATH.'/public/';

foreach (glob(VIEW_PATH."*.phtml") as $src) {
    $dst = PUBLIC_PATH.pathinfo($src, PATHINFO_FILENAME).'.html';
    file_put_contents($dst, getSrcContent($src));
}

passthru("aws --profile gsati s3 sync ".str_replace(' ', '\ ', PUBLIC_PATH)." s3://integrations-c7-gui/");

/**
 * @param  mixed  $src
 * @return false|string
 */
function getSrcContent(mixed $src): string|false
{
    ob_start();
    include $src;
    $output = ob_get_contents();
    ob_end_clean();
    return $output;
}