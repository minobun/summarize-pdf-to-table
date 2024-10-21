# Tablify PDF

## Release Note
### v0.2.0-beta
#### スプレットシート機能
- PDFから抽出した情報をスプレッドシート形式で扱えるようになりました。

#### PDF探索機能
- URLを指定するとURL配下のPDFを探索できるようになりました。
- 探索キーワードによって生成AIを利用したPDFを探索できるようになりました。

#### PDF探索＋PDF抽出機能の実装
- PDF探索後に得られたURLを利用してPDF抽出ができるようになりました。

#### faviconの導入
- faviconを導入しました。

#### 機能改善
- テーブルの表示不具合を修正しました。
- PDF探索ができなくなる不具合を修正しました。

## For Developers Tips

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
