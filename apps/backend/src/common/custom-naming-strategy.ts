import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
    }

    columnName(propertyName: string, customName: string | undefined, embeddedPrefixes: string[]): string {
        return customName ? customName : snakeCase(embeddedPrefixes.concat(propertyName).join("_"));
    }

    relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(`id_${relationName}`);
    }

    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string): string {
        return snakeCase(`${firstTableName}_${secondTableName}`);
    }

    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return snakeCase(`${tableName}_${columnName ? columnName : propertyName}`);
    }
}
