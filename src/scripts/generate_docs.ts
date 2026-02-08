
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OPENAPI_PATH = path.join(__dirname, '../../openapi.json');
const OUTPUT_FILE = path.join(__dirname, '../../faction_api_docs.md');

async function main() {
    console.log('Loading OpenAPI spec...');
    const openApiRaw = fs.readFileSync(OPENAPI_PATH, 'utf-8');
    const openApi = JSON.parse(openApiRaw);

    const factionPaths = Object.keys(openApi.paths).filter(p => p.startsWith('/faction/'));
    console.log(`Found ${factionPaths.length} Faction endpoints.`);

    let markdown = '# Faction API Documentation\n\n' +
        'This document outlines the available Faction API endpoints, their schema definitions (from Torn OpenAPI), ' +
        'and current data coverage in our local database.\n\n';

    for (const apiPath of factionPaths) {
        const endpointName = apiPath.replace('/faction/', '');
        const pathDef = openApi.paths[apiPath].get;

        if (!pathDef) continue;

        const summary = pathDef.summary || 'No summary';
        const description = pathDef.description || 'No description';
        const schemaRef = pathDef.responses?.['200']?.content?.['application/json']?.schema?.['$ref'];

        console.log(`Processing ${endpointName}...`);

        markdown += `## ${endpointName}\n\n`;
        markdown += `**API Endpoint:** \`https://api.torn.com/v2${apiPath}\`\n\n`;
        markdown += `**Summary:** ${summary}\n\n`;
        markdown += `**Description:** ${description.replace(/<br>/g, '\n')}\n\n`;

        // Check DB for sample data
        const dbRecord = await prisma.factionRawData.findFirst({
            where: { endpoint: endpointName },
            orderBy: { createdAt: 'desc' }
        });

        if (dbRecord) {
            markdown += `✅ **Data Available Locally** (Last Updated: ${dbRecord.createdAt.toISOString()})\n\n`;
        } else {
            markdown += `❌ **No Data Locally**\n\n`;
        }

        markdown += `### Field Schema\n\n`;
        markdown += `| Field | Type | Description | Sample Validated? |\n`;
        markdown += `|---|---|---|---|\n`;

        if (schemaRef) {
            const schemaName = schemaRef.split('/').pop();
            const schemaDef = openApi.components.schemas[schemaName];

            if (schemaDef && schemaDef.properties) {
                const sampleData = dbRecord?.data as any || {};

                for (const [propName, propDef] of Object.entries(schemaDef.properties) as [string, any][]) {
                    const type = propDef.type || 'object';
                    const desc = (propDef.description || '').replace(/\n/g, ' ');

                    let validated = '❌';
                    if (sampleData[propName] !== undefined) {
                        const val = sampleData[propName];
                        const valType = Array.isArray(val) ? 'array' : typeof val;
                        const valPreview = JSON.stringify(val).substring(0, 20).replace(/"/g, "'");
                        validated = `✅ (${valPreview}...)`;
                    }

                    markdown += `| \`${propName}\` | ${type} | ${desc} | ${validated} |\n`;
                }
            }
        } else {
            markdown += `| (No Schema Definition Found) | | | |\n`;
        }

        markdown += `\n---\n\n`;
    }

    fs.writeFileSync(OUTPUT_FILE, markdown);
    console.log(`Documentation generated at ${OUTPUT_FILE}`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
