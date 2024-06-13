import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface TableEntity {
    readonly Id: number;
    Name: string;
    Radius: number;
}

export interface TableCreateEntity {
    readonly Name: string;
    readonly Radius: number;
}

export interface TableUpdateEntity extends TableCreateEntity {
    readonly Id: number;
}

export interface TableEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Radius?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Radius?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Radius?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Radius?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Radius?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Radius?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Radius?: number;
        };
    },
    $select?: (keyof TableEntity)[],
    $sort?: string | (keyof TableEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface TableEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<TableEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface TableUpdateEntityEvent extends TableEntityEvent {
    readonly previousEntity: TableEntity;
}

export class TableRepository {

    private static readonly DEFINITION = {
        table: "VOT_TABLE",
        properties: [
            {
                name: "Id",
                column: "TABLE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "TABLE_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Radius",
                column: "TABLE_RADIUS",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(TableRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: TableEntityOptions): TableEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): TableEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: TableCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOT_TABLE",
            entity: entity,
            key: {
                name: "Id",
                column: "TABLE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: TableUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOT_TABLE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "TABLE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: TableCreateEntity | TableUpdateEntity): number {
        const id = (entity as TableUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as TableUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "VOT_TABLE",
            entity: entity,
            key: {
                name: "Id",
                column: "TABLE_ID",
                value: id
            }
        });
    }

    public count(options?: TableEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOT_TABLE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: TableEntityEvent | TableUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("tabler-entities-Table", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("tabler-entities-Table").send(JSON.stringify(data));
    }
}
