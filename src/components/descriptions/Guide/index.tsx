export const GuideDescription = `
# Tablify PDF（β版） 使い方ガイド
## アプリケーションの概要
このアプリケーションは、指定されたPDFからテーブル情報を抽出し、表示・編集することができます。利用者はカラム情報を編集して再度抽出し、目的に合わせたテーブルデータを確認することが可能です。

## PDF抽出
### 利用手順
1. 抽出したいPDFのURLを入力
- 画面上部の入力フィールドに、抽出したいPDFのURLを入力します。
- PDFが複数ある場合は、追加ボタンを押して、複数のURLを入力できます。

2. カラムを作成
- 入力したPDFから抽出するデータのカラムを作成します。
- 「指定したPDFでカラムの作成」ボタンをクリックします。

3. カラムの編集（任意）
- カラム情報を調整したい場合は、「列を追加」や「行を追加」、または「カラム情報の編集」ボタンを使ってカラムをカスタマイズできます。

4. データ抽出
- 「指定したカラム情報でPDFからデータを抽出」ボタンをクリックすると、PDFから指定したカラムに基づいてデータが抽出されます。

5. 出力形式を選択
- CSV形式で出力 または EXCEL形式で出力 ボタンをクリックして、データを保存します。


### 注意事項
1. 正しいPDFのURLを入力してください
- 不正確なURLや無効なURLを入力した場合、抽出処理が正しく行われないことがあります。必ず正しいPDFのURLを指定してください。

2. 見出しの編集について
- カラムや見出しを編集した場合、再度データを抽出しない限り、編集内容は反映されません。編集後は必ず再抽出を行ってください。

## PDF探索
### 利用手順手順
1. 検索先URLの入力
- 探索したいPDFファイルのURLを入力します。
- このURLが探索の対象となります。

2. 探索階層の指定
- 探索する深さを設定します。デフォルトでは「1階層」に設定されていますが、必要に応じて階層を変更できます。
- 階層が深いほど、URL内のリンクや関連するPDFファイルを探索できます。

3. PDFファイルの探索
- URLと探索階層を指定したら、「PDFファイルの探索」ボタンをクリックします。
- 指定されたURLと探索階層に基づいて、PDFファイルの探索が開始されます。

4. 探索結果の確認
- 探索されたPDFファイルが一覧表示され、そこから更に操作を行うことができます。

### 注意事項
1. 動作の保証について
- PDF探索機能は全てのPDFやウェブサイトでの動作を保証するものではありません。探索結果や精度は、対象サイトの構造やPDFの仕様によって異なります。

2. 不正利用について
- 本機能を不正に利用した場合、アクセス制限や利用停止などの措置を取ることがあります。利用規約に従ってご利用ください。


`;
