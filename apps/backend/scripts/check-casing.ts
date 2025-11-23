import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

function checkImports(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    sourceFile.forEachChild(node => {
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
            if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                const importPath = node.moduleSpecifier.text;

                if (importPath.startsWith('.')) {
                    const dir = path.dirname(filePath);
                    const absoluteImportPath = path.resolve(dir, importPath);

                    // Check if file exists with exact casing
                    let found = false;
                    let extensions = ['.ts', '.tsx', '/index.ts', ''];

                    for (const ext of extensions) {
                        const pathWithExt = absoluteImportPath + ext;
                        if (fs.existsSync(pathWithExt)) {
                            const actualFileName = fs.readdirSync(path.dirname(pathWithExt)).find(f => f.toLowerCase() === path.basename(pathWithExt).toLowerCase());
                            if (actualFileName && actualFileName !== path.basename(pathWithExt)) {
                                console.error(`❌ Case mismatch in ${filePath}:`);
                                console.error(`   Import: ${importPath}`);
                                console.error(`   Expected: ${path.basename(pathWithExt)}`);
                                console.error(`   Actual:   ${actualFileName}`);
                            }
                            found = true;
                            break;
                        }
                    }
                }
            }
        }
    });
}

const srcDir = path.resolve(__dirname, '../src');
console.log(`🔍 Checking imports in ${srcDir}...`);
const allFiles = getAllFiles(srcDir);

allFiles.forEach(file => {
    checkImports(file);
});

console.log('✅ Check complete.');
