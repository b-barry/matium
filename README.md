# Matium [![stability][0]][1]
[![npm version][2]][3] [![downloads][8]][9] 

Markdown imports to Medium, done right :)
`
## Installation
```sh
$ npm install -g matium or yarn global add matium
````
## Getting Started
1. [Get a third party integration token on medium][medium]
1. [Get a personal access tokens on Github with Gist][github]
2. Create an markdown article and add all metadata needed
3. Run `matium ./article.md --medium-token myMediumToken --gist-token myGistToken `

## Usage`

```txt
Usage: matium <files ...> [options]


  Options:

    -V, --version               output the version number
    -m, --medium-token [token]  Third party integration token on medium, stored after first use
    -g, --gist-token [token]    Gist authentication token, stored after first use
    -h, --help                  output usage information
    
```

## Metadata

Use `YAML` matter in your markdown to specify all the metadata:

```
---
title: 'A title'
publication: 'a medium publication name'
canonicalUrl: 'a canonical url'
tags: 
   - tag 1
   - tag 2
license: 'public-domain'
gists:
  - gist id created 1
  - gist id created 2
---
```

The gists metadata is autogenerated with all gist id created

License options:
* `all-rights-reserved`
* `cc-40-by`
* `cc-40-by-nd`
* `cc-40-by-sa`
* `cc-40-by-nc`
* `cc-40-by-nc-nd`
* `cc-40-by-nc-sa`
* `cc-40-zero`
* `public-domain`

## See Also
- [medium api docs](https://github.com/Medium/medium-api-docs)
- [github api docs](https://developer.github.com/v3)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[github]: https://github.com/settings/tokens
[medium]: https://medium.com/me/settings

