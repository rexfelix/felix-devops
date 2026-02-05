# My Project
[![Release](https://img.shields.io/github/v/release/rexfelix/felix-devops?label=version)](https://github.com/rexfelix/felix-devops/releases)

# create-felix-devops

A customized DevOps project generator CLI.
This tool scaffolds a new project with pre-configured DevOps tools, including Semantic Release and GitHub Actions.

## Installation

You can use this package directly with `npx`:

```bash
npx create-felix-devops
```

Or install it globally:

```bash
npm install -g create-felix-devops
```

## Usage

Run the following command and follow the interactive prompts to create a new project:

```bash
npx create-felix-devops
```

## Features

- **Interactive CLI**: Easy-to-use project setup wizard.
- **Pre-configured Template**: Includes standard DevOps configurations.
  - Semantic Release (`.releaserc.json`)
  - GitHub Actions Workflows (`.github/`)
  - Documentation structure (`docs/`)

---

# 🚀 Felix DevOps Starter
## Commitizen + Semantic Release + GitHub Releases 자동화 템플릿

이 프로젝트는 **새 프로젝트를 시작할 때 DevOps/Release 자동화를 한 번에 세팅해주는 스타터 템플릿 생성기**입니다.

목표는 단 하나입니다.

👉 **main 브랜치에 merge/push만 하면 버전 · 태그 · CHANGELOG · GitHub Release가 자동 생성되게 만든다**

즉,

- 수동 버전 관리 ❌
- 수동 릴리즈 노트 ❌
- 수동 태그 ❌
- 수동 GitHub Release ❌

➡ 전부 자동화 ✅

---

# ✅ 이 템플릿이 제공하는 기능

프로젝트 생성 시 자동 포함:

- Commitizen (cz) – 커밋 메시지 표준화
- Semantic Release – 버전 자동 계산
- GitHub Actions – 릴리즈 자동 실행
- CHANGELOG 자동 생성
- 릴리즈 매뉴얼 문서 포함

---

# 📦 새 프로젝트 생성 방법

### 방법 1 (권장)
npm init felix-devops

### 방법 2
npx create-felix-devops

---

# 🚀 생성 후 초기 세팅

cd my-app
npm install
git init
git add .
git commit -m "chore: init"

(선택)
git remote add origin <YOUR_REPO>
git branch -M main
git push -u origin main

---

# ✍️ 커밋 규칙 (가장 중요)

❌ git commit -m 직접 사용 금지  
✅ 항상 Commitizen 사용

git add -A
npm run commit

질문에 답하면 표준 커밋 메시지가 자동 생성됩니다.

---

# 📌 버전 자동 상승 규칙 (SemVer)

Semantic Release는 커밋 타입을 보고 버전을 결정합니다.

PATCH (버그 수정)
fix: something

MINOR (기능 추가)
feat: something

MAJOR (호환 깨짐)
feat!: something
또는
BREAKING CHANGE: something

예시:

feat(auth): 로그인 추가 → 1.1.0  
fix(api): 오류 수정 → 1.1.1  
feat!: API 변경 → 2.0.0  

---

# 🌿 권장 브랜치 전략

feature/* → main  
또는  
feature/* → dev → main

중요:

👉 릴리즈는 main 브랜치에서만 발생

main push = 자동 릴리즈

---

# 🔄 실제 개발 흐름

1. 기능 개발
   git checkout -b feature/login
   npm run commit

2. 병합
   git checkout main
   git merge feature/login
   git push

3. 끝

GitHub Release 자동 생성

---

# 🧪 릴리즈 미리보기 (선택)

npx semantic-release --dry-run

실제 릴리즈 없이 버전/노트만 확인 가능

---

# 📂 생성되는 프로젝트 구조

my-app/
- package.json
- .releaserc.json
- CHANGELOG.md
- docs/RELEASE_AUTOMATION.md
- .github/workflows/release.yml

---

# ❗ 자주 발생하는 문제

릴리즈가 안 됨
→ 커밋 메시지 규칙 위반 (feat/fix 사용 필수)

GitHub Actions 실패
→ permissions: contents: write 필요

template 누락
→ npm publish 전에 files 설정 확인

---

# 🎯 운영 철학

작은 단위 커밋  
자동화 가능한 건 모두 자동화  
릴리즈는 사람이 하지 않는다  
main은 항상 배포 가능 상태 유지  

Slow is smooth. Smooth is fast.


# 🏗️ 기존 프로젝트에 적용하는 방법 (수동 설정)

이미 개발 중인 프로젝트에 이 템플릿의 기능을 적용하려면 아래 단계를 따라주세요.

### 1. 패키지 설치
필요한 패키지들을 개발 의존성(devDependencies)으로 설치합니다.

```bash
npm install -D commitizen cz-conventional-changelog semantic-release @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/github @semantic-release/git @semantic-release/changelog
```

### 2. package.json 설정
`package.json` 파일에 다음 내용을 추가합니다.

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### 3. 설정 파일 생성

**root 경로에 `.releaserc.json` 생성:**

```json
{
  "branches": ["main"],
  "tagFormat": "v${version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { "changelogFile": "CHANGELOG.md" }],
    ["@semantic-release/github", { "assets": [] }],
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }]
  ]
}
```

**root 경로에 `.github/workflows/release.yml` 생성:**

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

### 4. 적용 완료
이제 `git add .`, `git commit` 후 `main` 브랜치에 푸시하면 설정이 완료됩니다.
이후 커밋 시 `npm run commit`을 사용하세요.


---

# ✅ 한 줄 요약

개발자는  
코드 작성 + commit + merge  

나머지는  
전부 자동

👉 이것이 회사급 DevOps 워크플로우

---

## License

MIT