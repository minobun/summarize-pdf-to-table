# Tablify PDF


## For Developers Tis

### Update `xlsx` liberary

`xlsx` library is not provided through npm.
Reference: https://cdn.sheetjs.com/

So if you have to update library, execute the command below.

```bash
npm install --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

### Tips

If you have encountered the error related to IPv6 Error after executing `npm install`, execute the command below.

```bash
export NODE_OPTIONS=--dns-result-order=ipv4first
```