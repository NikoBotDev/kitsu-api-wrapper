# Kitsu API Wrapper

A wrapper for the [Kitsu API](https://kitsu.docs.apiary.io).

## Getting started

To install the package, just install it from this repository:

```npm i NikoBotDev/kitsu-api-wrapper```

## Testing

Just clone this repository using:

```git clone https://github.com/NikoBotDev/kitsu-api-wrapper.git```

Then go to the folder using cmd and run the following:

```npm run test```

## Usage

### Get anime

```javascript 
    const Kitsu = require('kitsu-api-wrapper');

    Kitsu.getAnime('Naruto').then(anime => {
        // Do things with the anime object :D
    });

```

### Get Mangá

```javascript 
    const Kitsu = require('kitsu-api-wrapper');

    Kitsu.getManga('Naruto').then(manga => {
        // Do things with the manga object :D
    });

```

## License

This package is licensed under the **MIT** license **(see the LICENSE file for more information)**. I have neither created or contributed to the development of The Kitsu API, and this package is not affiliated with its developers in any way.