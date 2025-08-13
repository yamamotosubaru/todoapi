# TODO管理API

Node.js + Express + MySQLを使用したTODO管理アプリケーションです。TypeScriptで型安全な開発を行い、Docker Composeによる開発環境とAWSへの自動デプロイメントをサポートしています。

## 📋 機能

### 基本機能
- ✅ **TODO作成・更新・削除** - タイトルと詳細な内容でタスク管理
- ✅ **TODO一覧表示** - 作成日時順での表示
- ✅ **キーワード検索** - タイトルと内容での全文検索
- ✅ **ステータス管理** - TODO, IN_PROGRESS, DONEでの進捗管理
- ✅ **ヘルスチェック** - システム状態の監視

## 🚀 APIエンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| `POST` | `/todo` | 新しいTODOを作成 |
| `GET` | `/todo` | 全TODO一覧を取得 |
| `GET` | `/search?word={キーワード}` | キーワードでTODOを検索 |
| `PUT` | `/todo/{id}` | 指定IDのTODOを更新 |
| `DELETE` | `/todo/{id}` | 指定IDのTODOを削除 |
| `GET` | `/health` | システムヘルスチェック |

## 🛠️ 開発環境セットアップ

### Docker Compose使用（推奨）

```bash
# リポジトリをクローン
git clone <repository-url>
cd express-demo

# 依存関係のインストール
npm install

# データベースのテーブルを作成
# 後述のSQLを実行

# Docker Composeでサービスを起動
docker compose up -d

# ログを確認
docker compose logs -f app
```

アプリケーションは http://localhost:3000 でアクセス可能です。

## 📊 データベース

### テーブル構造

```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('TODO', 'DONE', 'IN_PROGRESS') DEFAULT 'TODO',
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
```

### 環境変数

```bash
# データベース接続設定
DB_HOST=db          # Docker Compose使用時
DB_USER=root
DB_PASSWORD=password
DB_NAME=todo_db

# アプリケーション設定
NODE_ENV=development
PORT=3000
```

## 🏗️ 技術スタック

### バックエンド
- **Node.js** 22.x - JavaScriptランタイム
- **Express.js** - Webアプリケーションフレームワーク
- **TypeScript** - 型安全な開発
- **MySQL** 8.4 - リレーショナルデータベース

### インフラストラクチャ
- **Docker** - コンテナ化
- **Docker Compose** - 開発環境オーケストレーション
- **AWS EC2** - 本番環境ホスティング
- **AWS ECR** - コンテナレジストリ
- **GitHub Actions** - CI/CDパイプライン

## 🔧 開発ツール

### よく使用するコマンド

```bash
# 開発環境の起動
docker compose up -d

# ログの確認
docker compose logs -f app

# 開発環境の停止
docker compose down

# データベースのリセット
docker compose down -v
docker compose up -d

# コンテナ内でのシェル実行
docker compose exec app bash
```

### デバッグ

```bash
# アプリケーションログ
docker compose logs app

# データベース接続確認
curl http://localhost:3000/health

# MySQL直接接続
docker compose exec db mysql -u root -p todo_db
```

## 🚢 デプロイメント

### 自動デプロイ

mainブランチへのpushで自動的にAWS EC2にデプロイされます：

1. **コードプッシュ** → GitHub Actions起動
2. **Dockerイメージ作成** → Gitハッシュでタグ付け
3. **ECRプッシュ** → セキュアなイメージ保存
4. **EC2デプロイ** → Session Manager経由でゼロダウンタイム

### 必要なGitHub Secrets

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
EC2_INSTANCE_ID=i-1234567890abcdef0
DB_HOST=your-rds-endpoint
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=todo_db
```

## 📖 APIドキュメント

### OpenAPI仕様

完全なAPI仕様は [`openapi.yaml`](./openapi.yaml) をご覧ください。

### レスポンス例

```json
// GET /todo
{
  "todos": [
    {
      "id": 1,
      "title": "買い物",
      "content": "牛乳とパンを買う",
      "status": "TODO",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```
