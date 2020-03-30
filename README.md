# compare-user.js

Script that generates an `user.js` based on several privacy-advocate versions:

- [yokoffing](https://github.com/yokoffing/Better-Fox),
- [pyllyukko](https://github.com/pyllyukko/user.js), and
- [ghacks](https://github.com/ghacksuserjs/ghacks-user.js).


To generate a `user.js` use:

```sh
$ node compare-user.js user.js
```

The algorithm adds a preference if there are >=50% with the same value and
there no other value. The output file is already a valid file to include in
your profile directory:

```sh
$ cp user.js ~/.mozila/firefox/xxxxxxxx.default/
```

## HTML Output

It is possible to output an HTML table (with some CSS inspired by [bootstrap])
with:

```sh
$ node compare-user.js index.html
```

Check the [last generated version].

[bootstrap]: https://github.com/twbs/bootstrap/blob/81df608a40bf0629a1dc08e584849bb1e43e0b7a/dist/css/bootstrap.css
[last generated version]: https://yokoffing.github.io/compare-user.js/

