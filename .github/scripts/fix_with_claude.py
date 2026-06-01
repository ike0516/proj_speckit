import os
import sys
import glob
import xml.etree.ElementTree as ET
import anthropic


def read_surefire_reports():
    failures = []
    for xml_file in glob.glob("target/surefire-reports/TEST-*.xml"):
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for testcase in root.findall("testcase"):
            failure = testcase.find("failure")
            error = testcase.find("error")
            if failure is not None or error is not None:
                node = failure if failure is not None else error
                failures.append({
                    "classname": testcase.get("classname", ""),
                    "test": testcase.get("name", ""),
                    "message": node.get("message", ""),
                    "detail": node.text or "",
                })
    return failures


def find_java_file(classname, base_dirs):
    path = classname.replace(".", "/") + ".java"
    for base in base_dirs:
        full_path = f"{base}/{path}"
        if os.path.exists(full_path):
            return full_path
    return None


def collect_source_files(failures):
    files = {}
    for failure in failures:
        classname = failure["classname"]

        test_file = find_java_file(classname, ["src/test/java"])
        if test_file and test_file not in files:
            with open(test_file) as f:
                files[test_file] = f.read()

        impl_classname = classname.removesuffix("Tests").removesuffix("Test")
        impl_file = find_java_file(impl_classname, ["src/main/java"])
        if impl_file and impl_file not in files:
            with open(impl_file) as f:
                files[impl_file] = f.read()

    return files


def fix_with_claude(failures, source_files):
    client = anthropic.Anthropic()

    failure_text = "\n\n".join(
        f"Test: {f['classname']}.{f['test']}\nMessage: {f['message']}\n{f['detail']}"
        for f in failures
    )

    files_text = "\n\n".join(
        f"File: {path}\n```java\n{content}\n```"
        for path, content in source_files.items()
    )

    prompt = f"""以下のJUnitテストが失敗しています。実装コードを修正してテストが通るようにしてください。
テストコード自体は変更しないでください。

## テスト失敗内容

{failure_text}

## ソースコード

{files_text}

## 回答形式

修正が必要なファイルごとに以下の形式で回答してください。

FILE: <ファイルパス>
```java
<修正後のコード全体>
```
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )

    response = message.content[0].text
    fixed_files = []
    lines = response.split("\n")
    i = 0

    while i < len(lines):
        if lines[i].startswith("FILE: "):
            filepath = lines[i][6:].strip()
            i += 1
            code_lines = []
            in_block = False
            while i < len(lines):
                if lines[i].startswith("```"):
                    if not in_block:
                        in_block = True
                    else:
                        break
                elif in_block:
                    code_lines.append(lines[i])
                i += 1
            if code_lines and filepath:
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                with open(filepath, "w") as f:
                    f.write("\n".join(code_lines))
                fixed_files.append(filepath)
                print(f"Fixed: {filepath}")
        i += 1

    return fixed_files


def main():
    failures = read_surefire_reports()

    if not failures:
        print("テスト失敗なし")
        sys.exit(0)

    print(f"{len(failures)} 件のテスト失敗:")
    for f in failures:
        print(f"  - {f['classname']}.{f['test']}: {f['message']}")

    source_files = collect_source_files(failures)
    fixed = fix_with_claude(failures, source_files)

    if not fixed:
        print("修正できませんでした")
        sys.exit(1)

    print(f"\n{len(fixed)} ファイルを修正しました")


if __name__ == "__main__":
    main()
