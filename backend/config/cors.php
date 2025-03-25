<?php

return [
// 'paths' => ['api/*'],

// /*
// * Matches the request method. `['*']` allows all methods.
// */
// 'allowed_methods' => ['*'],

// /*
//  * Matches the request origin. `['*']` allows all origins. Wildcards can be used, eg `*.mydomain.com`
//  */
// 'allowed_origins' => ['*'],

// /*
//  * Patterns that can be used with `preg_match` to match the origin.
//  */
// 'allowed_origins_patterns' => ['*'],

// /*
//  * Sets the Access-Control-Allow-Headers response header. `['*']` allows all headers.
//  */
// 'allowed_headers' => ['*'],

    'paths' => ['api/*'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 86400, // 24 hours
    'supports_credentials' => true, // If using cookies/auth

];
