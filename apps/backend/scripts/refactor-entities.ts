import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const SRC_DIR = path.join(__dirname, '../src');

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // 1. Remove name from @Entity({ name: '...' })
    content = content.replace(/@Entity\(\s*{\s*name:\s*['"][^'"]+['"]\s*}\s*\)/g, '@Entity()');
    content = content.replace(/@Entity\(\s*['"][^'"]+['"]\s*\)/g, '@Entity()');

    // 2. Remove name from @Column({ name: '...' })
    // Matches @Column({ name: 'FOO', ... }) or @Column({ ..., name: 'FOO' })
    content = content.replace(/@Column\(\s*{([^}]*?)\bname:\s*['"][^'"]+['"]\s*,?\s*([^}]*?)}\s*\)/g, (match, p1, p2) => {
        const combined = (p1 + p2).trim();
        if (combined === '' || combined === ',') return '@Column()';
        // Clean up trailing/leading commas
        const cleaned = combined.replace(/^,\s*/, '').replace(/\s*,\s*$/, '').replace(/,\s*,/, ',');
        return `@Column({ ${cleaned} })`;
    });

    // 3. Remove name from @JoinColumn({ name: '...' })
    content = content.replace(/@JoinColumn\(\s*{([^}]*?)\bname:\s*['"][^'"]+['"]\s*,?\s*([^}]*?)}\s*\)/g, (match, p1, p2) => {
        const combined = (p1 + p2).trim();
        if (combined === '' || combined === ',') return '@JoinColumn()';
        const cleaned = combined.replace(/^,\s*/, '').replace(/\s*,\s*$/, '').replace(/,\s*,/, ',');
        return `@JoinColumn({ ${cleaned} })`;
    });

    // 4. Clean up empty options in decorators: @Column({ }) -> @Column()
    content = content.replace(/@Column\(\s*{\s*}\s*\)/g, '@Column()');
    content = content.replace(/@JoinColumn\(\s*{\s*}\s*\)/g, '@JoinColumn()');

    if (content !== originalContent) {
        console.log(`Updating ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}

try {
    const files = glob.sync(path.join(SRC_DIR, '**/*.entity.ts').replace(/\\/g, '/'));
    console.log(`Found ${files.length} entity files.`);
    files.forEach(processFile);
    console.log('Done.');
} catch (err) {
    console.error('Error finding files:', err);
}
