#!/usr/bin/env python3
"""
Script para migração automática de módulos para arquitetura multitenant
Adiciona ID_EMPRESA às entidades e refatora services
"""

import os
import re
from pathlib import Path

# Módulos e suas entidades principais
MODULES = {
    'os': ['os-status', 'os-equipamento', 'os-abertura'],
    'afv': ['tabela-preco', 'vendedor-meta', 'vendedor-rota'],
    'ged': ['ged-tipo-documento', 'ged-documento-cabecalho'],
    'inventario': ['inventario-contagem-cab']
}

BASE_PATH = Path('src')

def add_empresa_to_entity(entity_path):
    """Adiciona ID_EMPRESA a uma entidade"""
    with open(entity_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Verifica se já tem ID_EMPRESA
    if 'ID_EMPRESA' in content or 'empresa: Empresa' in content:
        print(f"  ✓ {entity_path.name} já tem ID_EMPRESA")
        return False
    
    # Adiciona imports
    if 'ManyToOne' not in content:
        content = re.sub(
            r'(import \{ Entity[^}]+)\}',
            r'\1, ManyToOne, JoinColumn }',
            content
        )
    
    if 'Empresa' not in content:
        # Adiciona import do Empresa
        content = re.sub(
            r"(import \{[^}]+\} from '\.\.\/\.\.\/entities-export';)",
            r"import { Empresa } from '../../entities-export';\n\1",
            content
        )
    
    # Adiciona propriedade empresa antes do constructor
    empresa_property = """
    @ManyToOne(() => Empresa)
    @JoinColumn({ name: "ID_EMPRESA" })
    empresa: Empresa;
"""
    
    content = re.sub(
        r'(\s+/\*\*\s+\* Constructor\s+\*/)',
        empresa_property + r'\1',
        content
    )
    
    with open(entity_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Adicionado ID_EMPRESA a {entity_path.name}")
    return True

def refactor_service(service_path):
    """Refatora service para usar BaseRepository e TenantService"""
    with open(service_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Verifica se já está refatorado
    if 'BaseRepository' in content or 'Scope.REQUEST' in content:
        print(f"  ✓ {service_path.name} já está refatorado")
        return False
    
    # Adiciona imports
    content = re.sub(
        r"import \{ Injectable \} from '@nestjs/common';",
        "import { Injectable, Scope } from '@nestjs/common';",
        content
    )
    
    # Adiciona imports do TenantService e BaseRepository
    content = re.sub(
        r"(import \{ TypeOrmCrudService \} from '@nestjsx/crud-typeorm';)",
        r"\1\nimport { TenantService } from '../../tenant/tenant.service';\nimport { BaseRepository } from '../../common/base.repository';",
        content
    )
    
    # Muda para Scope.REQUEST
    content = re.sub(
        r'@Injectable\(\)',
        '@Injectable({ scope: Scope.REQUEST })',
        content
    )
    
    # Refatora constructor
    content = re.sub(
        r'constructor\(\s+@InjectRepository\(([^)]+)\) repository\)\s*\{\s*super\(repository\);',
        r'''constructor(
    @InjectRepository(\1) repository,
    private readonly tenantService: TenantService
  ) { 
    super(new BaseRepository(repository, tenantService));''',
        content
    )
    
    with open(service_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Refatorado {service_path.name}")
    return True

def migrate_module(module_name, entities):
    """Migra um módulo completo"""
    print(f"\n📦 Migrando módulo: {module_name.upper()}")
    module_path = BASE_PATH / module_name
    
    if not module_path.exists():
        print(f"  ⚠️  Módulo {module_name} não encontrado")
        return
    
    changes = 0
    
    for entity_name in entities:
        entity_dir = module_path / entity_name
        if not entity_dir.exists():
            print(f"  ⚠️  Entidade {entity_name} não encontrada")
            continue
        
        # Migra entidade
        entity_file = entity_dir / f"{entity_name}.entity.ts"
        if entity_file.exists():
            if add_empresa_to_entity(entity_file):
                changes += 1
        
        # Migra service
        service_file = entity_dir / f"{entity_name}.service.ts"
        if service_file.exists():
            if refactor_service(service_file):
                changes += 1
    
    print(f"  ✅ {module_name.upper()}: {changes} arquivos modificados")
    return changes

def main():
    """Executa migração de todos os módulos"""
    print("🚀 Iniciando migração automática de módulos\n")
    
    total_changes = 0
    for module, entities in MODULES.items():
        changes = migrate_module(module, entities)
        total_changes += changes or 0
    
    print(f"\n✅ Migração concluída! Total de {total_changes} arquivos modificados")
    print("\n⚠️  IMPORTANTE: Execute 'pnpm build' para verificar se não há erros")

if __name__ == '__main__':
    main()
