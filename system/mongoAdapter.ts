// system/mongoAdapter.ts

import mongoose, { Model, Query, Schema } from 'mongoose';
import { dbConfig } from '@config/config';
import { loadModels } from './modelLoader';
import { hasMongoCache, readMongoCache, writeMongoCache } from './cacheFileSystem';

interface CustomSchemaOptions extends mongoose.SchemaOptions {
    softDelete?: boolean;
}
const cachedMongoModels: Record<string, Model<any>> = {}; // Collect all registered models
// Mapping Sequelize types to Mongoose Schema types
const typeMap: Record<string, any> = {
    STRING: String,
    TEXT: String,
    INTEGER: Number,
    BIGINT: Number,
    FLOAT: Number,
    DOUBLE: Number,
    DECIMAL: Number,
    BOOLEAN: Boolean,
    DATE: Date,
    DATEONLY: Date,
    TIME: String,  // Time would usually be represented as a String or Date in MongoDB
    UUID: String,  // UUID could be stored as a String
    UUIDV4: String,
    JSON: Object,   // Mongoose stores JSON objects as Object type
    JSONB: Object,  // Same for JSONB in PostgreSQL
    ENUM: String,   // We can use String and restrict values via enum options
    BLOB: Buffer,   // Blob could be stored as a Buffer
};
let isMongoConnected = false;


export async function rebuildMongoModelsFromCache(mongoose:any,rawSchemas: any[]) {
  await mongoose.connect(dbConfig.connections.mongo.uri);
  for (const model of rawSchemas) {
    const mongooseSchemaDef: Record<string, any> = {};

    for (const [field, config] of Object.entries(model.schema)) {
      const fieldConfig: any = {};
      const cfg = config as { type: string; allowNull?: boolean; unique?: boolean };

      const mongooseType = typeMap[cfg.type];
      if (!mongooseType) {
        console.warn(`Unsupported type "${cfg.type}" in model "${model.modelName}" field "${field}"`);
        continue;
      }

      fieldConfig.type = mongooseType;

      if (cfg.allowNull === false) {
        fieldConfig.required = true;
      }
      if (cfg.unique) {
        fieldConfig.unique = true;
      }

      mongooseSchemaDef[field] = fieldConfig;
    }

    const schemaOptions: CustomSchemaOptions = {
      timestamps: model.timestamps
        ? { createdAt: 'created_at', updatedAt: 'updated_at' }
        : false,
      versionKey: false,
      collection: model.tableName || undefined,
      softDelete: model.softDelete || false,
    };

    const mongooseSchema = new Schema(mongooseSchemaDef, schemaOptions);

    if (model.softDelete) {
      mongooseSchema.add({ deleted_at: { type: Date, default: null } });
    }

    // Use existing model if already registered, else define new model
    if (mongoose.models[model.modelName]) {
      cachedMongoModels[model.modelName] = mongoose.models[model.modelName];
    } else {
      cachedMongoModels[model.modelName] = mongoose.model(model.modelName, mongooseSchema);
    }
  }

  return { mongoose, cachedMongoModels };
}

export async function connectMongo() {
    

    if (await hasMongoCache()) {
        const modelDetails = await readMongoCache();
        isMongoConnected = true;
        const { cachedMongoModels } = await rebuildMongoModelsFromCache(mongoose,modelDetails);
        // console.log('MongoDB cache loaded',mongoose.models);
        return { mongoose, cachedMongoModels }; // Empty but returned to avoid reconnect
    }
    if (isMongoConnected) {
        return { mongoose, cachedMongoModels };
    }
    // Connect only once
    await mongoose.connect(dbConfig.connections.mongo.uri);
    isMongoConnected = true;
    console.log('MongoDB connected');

    const models = await loadModels();

    Object.values(models).forEach((model: any) => {
        if (model.schema && model.modelName) {
            const mongooseSchemaDef: Record<string, any> = {};

            for (const [field, config] of Object.entries(model.schema)) {
                const fieldConfig: any = {};
                const cfg = config as { type: string; allowNull?: boolean; unique?: boolean };
                const mongooseType = typeMap[cfg.type];

                if (!mongooseType) {
                    console.warn(`Unsupported type "${cfg.type}" in model "${model.modelName}" field "${field}"`);
                    continue;
                }

                fieldConfig.type = mongooseType;
                if (cfg.allowNull === false) fieldConfig.required = true;
                if (cfg.unique) fieldConfig.unique = true;

                mongooseSchemaDef[field] = fieldConfig;
            }

            const schemaOptions: CustomSchemaOptions = {
                timestamps: model.timestamps ? { createdAt: 'created_at', updatedAt: 'updated_at' } : false,
                versionKey: false,
                collection: model.tableName || undefined,
                softDelete: model.softDelete || false,
            };

            const mongooseSchema = new Schema(mongooseSchemaDef, schemaOptions);

            if (model.softDelete) {
                mongooseSchema.add({ deleted_at: { type: Date, default: null } });
            }
            console.log('Mongoose model created:', mongooseSchema);
            cachedMongoModels[model.modelName] = mongoose.model(model.modelName, mongooseSchema);
        }
    });

    // Cache this instead of full Mongoose models
    const rawSchemas = Object.entries(models).map(([modelName, model]) => ({
      modelName,
      schema: model.schema,
      tableName: model.tableName,
      timestamps: model.timestamps,
      softDelete: model.softDelete,
    }));
    await writeMongoCache(JSON.stringify(rawSchemas));

    return { mongoose, cachedMongoModels };
}

export async function connectMongoOld() {
    if(await hasMongoCache()) {
      const cachedMongoModels = await readMongoCache();
        return { cachedMongoModels };
    }
    const useCache = await hasMongoCache();
    // Connect to MongoDB using Mongoose
    await mongoose.connect(dbConfig.connections.mongo.uri);
    console.log('MongoDB connected');
    
    // Load models dynamically (ensure models are exported correctly)
    const models = await loadModels();

    // Register models with Mongoose
    Object.values(models).forEach((model: any) => {
        if (model.schema && model.modelName) {
            const mongooseSchemaDef: Record<string, any> = {};

            for (const [field, config] of Object.entries(model.schema)) {
                const fieldConfig: any = {};
                const cfg = config as { type: string; allowNull?: boolean; unique?: boolean };
                // Map type
                const mongooseType = typeMap[cfg.type];
                if (!mongooseType) {
                    console.warn(`Unsupported type "${cfg.type}" in model "${model.modelName}" field "${field}"`);
                    continue;
                }

                fieldConfig.type = mongooseType;

                // Convert allowNull → required
                if (cfg.allowNull === false) {
                    fieldConfig.required = true;
                }

                // Preserve other options like `unique`
                if (cfg.unique) {
                    fieldConfig.unique = true;
                }

                mongooseSchemaDef[field] = fieldConfig;
            }

            const schemaOptions: CustomSchemaOptions = {
                timestamps: model.timestamps
                ? { createdAt: 'created_at', updatedAt: 'updated_at' }
                : false,
                versionKey: false,
                collection: model.tableName || undefined,
                softDelete: model.softDelete || false, // ✅ your custom flag
            };
            const mongooseSchema = new Schema(mongooseSchemaDef, schemaOptions);
            if (model.softDelete) {
                mongooseSchema.add({
                  deleted_at: { type: Date, default: null },
                });
                // Exclude soft-deleted docs by default
                // mongooseSchema.pre(/^find/, function (next) {
                //     (this as Query<any, any>).where({ deleted_at: null });
                //     next();
                // });
            }
            
            console.log(mongooseSchema);
            cachedMongoModels[model.modelName] = mongoose.model(model.modelName, mongooseSchema);
            console.log('mongooseSchema', cachedMongoModels[model.modelName]);
        }
    });
    // Cache only metadata (model names)
    if (!useCache) {
      const modelNames = Object.keys(cachedMongoModels);
      await writeMongoCache(modelNames);
    }
    return { mongoose, cachedMongoModels };
}

export function convertMongoModelsToSwaggerSchemas(models: Record<string, any>) {
    const schemas: Record<string, any> = {};

    for (const [modelName, model] of Object.entries(models)) {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        for (const [field, config] of Object.entries(model.schema)) {
            const fieldConfig = config as { type: string; allowNull?: boolean; unique?: boolean };
            const swaggerField: Record<string, any> = {};

            switch (fieldConfig.type) {
                case 'STRING':
                case 'TEXT':
                case 'UUID':
                case 'UUIDV4':
                case 'TIME':
                case 'ENUM':
                    swaggerField.type = 'string';
                    break;
                case 'INTEGER':
                case 'BIGINT':
                case 'FLOAT':
                case 'DOUBLE':
                case 'DECIMAL':
                    swaggerField.type = 'number';
                    break;
                case 'BOOLEAN':
                    swaggerField.type = 'boolean';
                    break;
                case 'DATE':
                case 'DATEONLY':
                    swaggerField.type = 'string';
                    swaggerField.format = 'date-time';
                    break;
                case 'JSON':
                case 'JSONB':
                    swaggerField.type = 'object';
                    break;
                case 'BLOB':
                    swaggerField.type = 'string';
                    swaggerField.format = 'binary';
                    break;
                default:
                    swaggerField.type = 'string';
            }

            if (fieldConfig.unique) {
                swaggerField.uniqueItems = true; // Not a true Swagger property, but can be documented
            }

            if (fieldConfig.allowNull === false) {
                required.push(field);
            }

            properties[field] = swaggerField;
        }

        schemas[modelName] = {
            type: 'object',
            properties,
            ...(required.length > 0 ? { required } : {}),
        };
    }

    return schemas;
}

export async function refreshMongoModels() {
    const models = await loadModels();
    
    console.log('models', models);
    // Iterate over each model and update or create it in the Mongoose cache
    Object.values(models).forEach((model: any) => {
      if (model.schema && model.modelName) {
        const mongooseSchemaDef: Record<string, any> = {};
        
        for (const [field, config] of Object.entries(model.schema)) {
          const fieldConfig: any = {};
          const cfg = config as { type: string; allowNull?: boolean; unique?: boolean };
          
          const mongooseType = typeMap[cfg.type];
          if (!mongooseType) {
            console.warn(`Unsupported type "${cfg.type}" in model "${model.modelName}" field "${field}"`);
            continue;
          }
  
          fieldConfig.type = mongooseType;
  
          if (cfg.allowNull === false) {
            fieldConfig.required = true;
          }
  
          if (cfg.unique) {
            fieldConfig.unique = true;
          }
  
          mongooseSchemaDef[field] = fieldConfig;
        }
  
        const schemaOptions = {
          timestamps: model.timestamps
            ? { createdAt: 'created_at', updatedAt: 'updated_at' }
            : false,
          versionKey: false,
          collection: model.tableName || undefined,
          softDelete: model.softDelete || false,
        };
  
        const mongooseSchema = new Schema(mongooseSchemaDef, schemaOptions);
  
        if (model.softDelete) {
          mongooseSchema.add({
            deleted_at: { type: Date, default: null },
          });
        }
        cachedMongoModels[model.modelName] = mongoose.model(model.modelName, mongooseSchema);
      }
    });
    return cachedMongoModels;
}
  
  
export async function getMongoModels() {
  if (!isMongoConnected || Object.keys(cachedMongoModels).length === 0) {
    let { cachedMongoModels } = await connectMongo();
    console.log('MongoDB models loaded');
    return cachedMongoModels;
  } else {
    console.log('MongoDB models already loaded');
  }
  return cachedMongoModels;
}

