# Craft CMS Configuration Guide

This guide provides detailed instructions to configure Craft CMS for optimal use with the SDK. For additional information, refer to the official Craft CMS documentation.

## Additional References

- [Craft CMS](https://craftcms.com/docs/5.x/)
- [Craft Commerce](https://craftcms.com/docs/commerce/5.x/)

---

## Requirements

- **Craft CMS Pro**: A Pro license is required for full SDK functionality.
- **Craft Commerce**: Version 4 or higher is required for compatibility with the SDK.

---

## Configuring CORS for External Domain REST API Calls

### 1. Set `sameSiteCookieValue('None')` in `config/general.php`

This configuration allows third-party cookies and session handling across domains. Update your `config/general.php` file with the following:

```php
<?php
use craft\config\GeneralConfig;

return GeneralConfig::create()
    ->sameSiteCookieValue('None');
```

### 2. Configure CORS in `config/app.web.php`

In the `/config/app.web.php` file, define the origins (URLs) authorized to make API calls. Avoid using wildcards (`*`) for security reasons and specify exact URLs:

```php
<?php

return [
    'as corsFilter' => [
        'class' => \craft\filters\Cors::class,
        'cors' => [
            'Origin' => [
                'http://localhost:3000',
                'https://localhost:3000',
                'https://example.com',
            ],
            'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            'Access-Control-Allow-Headers' => [
                'Authorization',
                'Content-Type',
                'X-CSRF-Token', #Important
                'X-Requested-With' #Important
            ],
            'Access-Control-Allow-Credentials' => true,
        ],
    ],
];

```

---

## API Credentials Handling

The SDK automatically includes credentials like cookies and session information in API calls. No additional setup is required on the client side for this functionality to work seamlessly.
