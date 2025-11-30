
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const SRC_DIR = path.join(__dirname, 'src');

function findServiceFiles(): string[] {
    return glob.sync('**/*.service.ts', { cwd: SRC_DIR, absolute: true });
}

function getRelativePath(from: string, to: string): string {
    let rel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
    if (!rel.startsWith('.')) {
        rel = './' + rel;
    }
    // Remove extension
    return rel.replace(/\.ts$/, '');
}

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if it extends TypeOrmCrudService
    if (!content.includes('extends TypeOrmCrudService')) {
        return;
    }

    // Check if already using BaseRepository or TenantService to avoid double processing
    if (content.includes('BaseRepository') || content.includes('TenantService')) {
        console.log(`Skipping ${path.basename(filePath)} (already updated or custom)`);
        return;
    }

    console.log(`Processing ${path.basename(filePath)}...`);

    // 1. Update Imports
    // Add Scope to @nestjs/common
    if (content.includes("import { Injectable } from '@nestjs/common'")) {
        content = content.replace("import { Injectable } from '@nestjs/common'", "import { Injectable, Scope } from '@nestjs/common'");
    } else if (content.includes("import { Injectable, Scope } from '@nestjs/common'")) {
        // already has scope
    } else {
        // Try to find where Injectable is imported and add Scope
        content = content.replace(/import \{([^}]*)Injectable([^}]*)\} from '@nestjs\/common'/, "import {$1Injectable, Scope$2} from '@nestjs/common'");
    }

    // Calculate paths for TenantService and BaseRepository
    const tenantServicePath = path.join(SRC_DIR, 'tenant', 'tenant.service.ts');
    const baseRepoPath = path.join(SRC_DIR, 'common', 'base.repository.ts');

    const relTenant = getRelativePath(filePath, tenantServicePath);
    const relBaseRepo = getRelativePath(filePath, baseRepoPath);

    // Add new imports
    const importsToAdd = `
import { TenantService } from '${relTenant}';
import { BaseRepository } from '${relBaseRepo}';`;

    // Insert imports after the last import
    const lastImportIdx = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIdx);
    content = content.slice(0, endOfLastImport + 1) + importsToAdd + content.slice(endOfLastImport + 1);


    // 2. Update Decorator
    content = content.replace('@Injectable()', '@Injectable({ scope: Scope.REQUEST })');

    // 3. Update Constructor
    // Regex to find the constructor and capture the repository injection
    // Looking for: constructor( ... @InjectRepository(Entity) repository ... ) { super(repository); }
    // We need to be careful with variations.

    const constructorRegex = /constructor\s*\(\s*@InjectRepository\s*\(([^)]+)\)\s*(\w+)\s*\)\s*\{\s*super\(\s*\2\s*\)\s*;\s*\}/;

    const match = content.match(constructorRegex);

    if (match) {
        const entityName = match[1];
        const repoVarName = match[2];

        const newConstructor = `constructor(
    @InjectRepository(${entityName}) repository,
    private readonly tenantService: TenantService
  ) {
    super(new BaseRepository(repository, tenantService));
  }`;

        content = content.replace(constructorRegex, newConstructor);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${path.basename(filePath)}`);
    } else {
        // Try a slightly more flexible regex for cases with newlines or different formatting
        const flexibleRegex = /constructor\s*\(\s*[\s\S]*?@InjectRepository\s*\(([^)]+)\)\s*(\w+)[\s\S]*?\)\s*\{\s*super\(\s*\2\s*\)\s*;\s*\}/;
        const matchFlex = content.match(flexibleRegex);
        if (matchFlex) {
            const entityName = matchFlex[1];
            // We reconstruct the constructor entirely
            const newConstructor = `constructor(
    @InjectRepository(${entityName}) repository,
    private readonly tenantService: TenantService
  ) {
    super(new BaseRepository(repository, tenantService));
  }`;
            content = content.replace(flexibleRegex, newConstructor);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated ${path.basename(filePath)} (flexible match)`);
        } else {
            console.log(`Could not match constructor in ${path.basename(filePath)} - Manual check required`);
        }
    }
}

const files = findServiceFiles();
files.forEach(processFile);
