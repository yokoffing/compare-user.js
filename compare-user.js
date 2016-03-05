#!/usr/bin/env node

var HTMLFILE = "index.html", USERJS = {
  pyllyukko: "https://raw.githubusercontent.com/pyllyukko/user.js/master/user.js",
  CrisBRM: "https://raw.githubusercontent.com/CrisBRM/user.js/master/user.js",
  Narga: "https://raw.githubusercontent.com/Narga/user.js/master/user.js",
}

var http = require('https'), fs = require('fs'),
    vm = require('vm'), bl = require('bl')

function parse_userjs(n, u, cb) {
  // https://stackoverflow.com/a/7810354
  http.get(u, function(res) {
    res.setEncoding('utf8')
    res.pipe(bl(function(e, b) {
      if (e) { console.error(e) ; process.exit(1) }
      var src = b.toString()
      var ctx = { t: {}, user_pref: function(k, v) { ctx.t[k] = v } }
      if (src.substring(0, 1) == '#') src = '// ' + src
      vm.runInNewContext(src, ctx, n + '.js')
      cb(ctx.t)
    }))
  })
  .on('error', function(e) {
    console.error(e)
    process.exit(1)
  })
}

function render_value(v) {
  if (typeof v == "string") return '"' + v + '"'
  if (v === true) return '<span style="color:green">' + v + '</span>'
  if (v === false) return '<span style="color:darkred">' + v + '</span>'
  if (v === null) return ''
  return v
}

function render_table(t) {
  var h = '', b = '', i = 0

  for (n in USERJS) if (USERJS.hasOwnProperty(n)) h += '<th>' + n + '</th>'

  for (; i < t.length; i++) {
    b += '<tr>'
    b += '<td>' + t[i].id + '</td>'
    for (n in USERJS) if (USERJS.hasOwnProperty(n)) {
      b += '<td><code>'
        + render_value(typeof t[i].value[n] == "undefined" ? null : t[i].value[n])
        +  '</code></td>'
    }
    b += '</tr>'
  }

  return '<table>'
       + '<thead><tr><th>&nbsp;</th>' + h + '</tr></thead>'
       + '<tbody>' + b + '</tbody></table>'
}

function render_page(c) {
  var s = 'table,th,td{border-collapse:collapse;border:1px solid #222;padding:3px}'
        + 'tr:hover{background-color:#ccc}'
        + 'a.r{position:absolute;top:0;right:0;border:0}'

  return '<!DOCTYPE html><html><head><meta charset="utf-8">'
       + '<title>user.js</title><style>' + s + '</style></head><body>'
       + '<p>Compare different <code>user.js</code>.</p>'
       + '<div class="c">' + c + '</div>'
       + '<a href="https://github.com/jm42/compare-user.js" class="r">'
       + '<img src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png">'
       + '</a></body></html>'
}

function main() {
  var n, r, k, c = 1, t = {}
  for (n in USERJS) if (USERJS.hasOwnProperty(n)) {
    parse_userjs(n, USERJS[n], function(n) { return function(r) {
      for (k in r) if (r.hasOwnProperty(k)) {
        if (typeof t[k] == "undefined")
          t[k] = {}
        t[k][n] = r[k]
      }
      if (c++ >= Object.keys(USERJS).length) {
        // https://stackoverflow.com/a/30132433
        // https://stackoverflow.com/a/24080786
        t = Object.keys(t)
                  .map(function(k) { return { id: k, value: t[k] } })
                  .sort(function(a, b) { return +(a.id > b.id) || -(a.id < b.id) })
        // https://stackoverflow.com/a/21617560
        var stream = fs.createWriteStream(HTMLFILE).once("open", function() {
          stream.end(render_page(render_table(t)))
        })
      }
    }}(n))
  }
}

main()
