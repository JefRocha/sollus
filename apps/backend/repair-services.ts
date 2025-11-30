
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const SRC_DIR = path.join(__dirname, 'src');

function findServiceFiles(): string[] {
    return glob.sync('**/*.service.ts', { cwd: SRC_DIR, absolute: true });
}

function repairFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if file uses this.dataSource
    if (content.includes('this.dataSource')) {
        // Check if constructor has dataSource
        if (!content.includes('private dataSource: DataSource') && !content.includes('public dataSource: DataSource') && !content.includes('readonly dataSource: DataSource')) {
            console.log(`Repairing ${path.basename(filePath)} (missing DataSource)...`);

            // Add DataSource import if missing
            if (!content.includes('import { DataSource')) {
                // Try to add it to typeorm import
                if (content.includes("import { DataSource } from 'typeorm'")) {
                    // already there
                } else if (content.includes("from 'typeorm'")) {
                    content = content.replace(/import \{([^}]*)\} from 'typeorm'/, "import {$1, DataSource} from 'typeorm'");
                } else {
                    content = "import { DataSource } from 'typeorm';\n" + content;
                }
            }

            // Add to constructor
            // We expect the constructor to look like:
            // constructor(
            //   @InjectRepository(Entity) repository,
            //   private readonly tenantService: TenantService
            // ) {

            const constructorStartRegex = /constructor\s*\(\s*/;
            if (constructorStartRegex.test(content)) {
                content = content.replace(constructorStartRegex, 'constructor(\n    private dataSource: DataSource,\n    ');
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`Restored DataSource in ${path.basename(filePath)}`);
            } else {
                console.log(`FAILED to restore DataSource in ${path.basename(filePath)} - constructor not found?`);
            }
        }
    }
}

const files = findServiceFiles();
files.forEach(repairFile);
