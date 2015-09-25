# Spritesheet Tool

Generates an optimally-packed spritesheet out of a list of images.

## Overview

This is a wrapper around [`spritesmith`](https://www.npmjs.com/package/spritesmith). It takes a bunch of images and creates an optimal spritesheet out of them. Furthermore, it processes configurable templates, so that you can output information about the spritesheet in whatever format you need.

## Getting Started

To use this tool, you need to have [Node.js](https://nodejs.org/) and `npm` installed. Clone the repository, then run `npm install`. From there, you can run `node spritesheet` to see the usage. Basic usage looks like this:

	node spritesheet -n Example -t templates/cpp/template.h -t templates/cpp/template.cpp example/*.png

## Contributing

Did you write a useful template? Perhaps one for C#, or for Java, or for JSON, or something else? Submit a pull request!

## License

Licensed under the MIT license. Basically, you're free to do what you want with it. For further details, see LICENSE file.