#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ template 폴더는 "패키지 내부"에 있으므로 __dirname 기준으로 잡는다
const templateDir = path.join(__dirname, "template");

async function run() {
  console.log(chalk.cyan("\n🚀 DevOps Template Generator\n"));

  const { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      message: "Project name:",
      default: "my-app",
      validate: (v) => (v && v.trim().length > 0 ? true : "프로젝트 이름을 입력하세요.")
    }
  ]);

  const cwd = process.cwd();
  const targetDir = path.join(cwd, projectName);

  // ✅ 타깃 폴더가 이미 존재하면 안전하게 중단
  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`\n❌ 이미 폴더가 존재합니다: ${targetDir}\n`));
    process.exit(1);
  }

  // ✅ template 폴더 존재 확인
  if (!(await fs.pathExists(templateDir))) {
    console.log(chalk.red(`\n❌ template 폴더를 찾을 수 없습니다: ${templateDir}\n`));
    console.log("패키지에 template/ 디렉토리가 포함되어 배포되었는지 확인하세요.");
    process.exit(1);
  }

  // ✅ 복사
  await fs.copy(templateDir, targetDir);

  // ✅ 템플릿 package.json의 name을 projectName으로 치환(옵션)
  const pkgPath = path.join(targetDir, "package.json");
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    if (pkg && typeof pkg === "object") {
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }
  }

  console.log(chalk.green(`\n✅ Created ${projectName}\n`));
  console.log("Next steps:");
  console.log(`  cd ${projectName}`);
  console.log("  npm install");
  console.log("  git init");
  console.log("  git add . && git commit -m \"chore: init\"");
  console.log("\n(원하면 GitHub에 push 후 main에 merge하면 semantic-release가 자동 릴리즈합니다.)\n");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
