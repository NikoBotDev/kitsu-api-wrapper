# Kitsu API Wrapper

A wrapper for the [Kitsu API](https://kitsu.docs.apiary.io).

## Getting started

To install the package, just install it from this repository:

```npm i NikoBotDev/kitsu-api-wrapper```


## Usage

### Get anime

```javascript 
    const Kitsu = require('kitsu-api-wrapper');

    Kitsu.getAnime('Naruto').then(anime => {
        // Do things with the anime object :D
    });

```

### Get Manga

```javascript 
    const Kitsu = require('kitsu-api-wrapper');

    Kitsu.getManga('Naruto').then(manga => {
        // Do things with the manga object :D
    });

```

### Working with offsets

If you want to select a specific index you should use the offset param
**Offset must be a number**
You can just provide a number, or use a function which will be passed the values from the Api
```javascript
        Kitsu.getManga('Naruto', (mangas) => {
            // Get a random offset
            return Math.floor(Math.random() * mangas.length);
        }).then(manga => {
        
        });
```
*The offset function can be async too!*

## Testing

Just clone this repository using:

```git clone https://github.com/NikoBotDev/kitsu-api-wrapper.git```

Then go to the folder using cmd and run the following:

```npm run test```

## License

This package is licensed under the **MIT** license **(see the LICENSE file for more information)**. I have neither created or contributed to the development of The Kitsu API, and this package is not affiliated with its developers in any way.