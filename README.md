Scrape fields
=============

Example:
```javascript
var url = 'http://some-url.domain';

var fields = {
    SELECTOR: '.product',
    'brand': '.brand',
    'modelName': '.model-name',
    'price': {
        SELECTOR: '.price',
        'label', '.price-label',
        'price', '.price-field'
    }
};

scrapeFields(url, fields, function (err, data) {
    // Do something with the data...
});
    
```

When applied to a page with the following content:
```html
<body>
    <div class="product">
        <div class="product">A <strong>strong</strong> product!</div>
        <div class="brand">A <strong>cool</strong> brand!</div>
        <div class="model-name">Some <div>model</div></div>
        <div class="price">
            <span class="price-label">Cheaper than ever</span>
            <span>99$</span>
        </div>
    </div>
    <div class="product">
        <div class="brand">A <strong>cool</strong> brand!</div>
        <div class="model-name">Some <div>model</div></div>
        <div class="price">
            <span class="price-label">not <em>so</em> cheap!</span>
            <span>199$</span>
        </div>
    </div>
</body>
```

..the output(value of data in the the callback) is:
```javascript
[
    {
        product: "A strong product!",
        brand:  "A cool brand!",
        modelName: "Some model",
        price: {
            label: "Cheaper than ever",
            price: "99$"
        }
    },
    {
        product: null,
        brand:  "A cool brand!",
        modelName: "Some model",
        price: {
            label: "Not so cheap",
            price: "199$"
        }
    },
];
```
