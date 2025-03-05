import fs from 'fs';
import path from 'path';

async function fetchOpenAPISpec() {
  try {
    
    const response = await fetch(`http://localhost:8000/api/v1/openapi.json`, {
        headers: {
            "accept": "application/json",
        },
        method: "GET",
        mode: "cors",
        credentials: "omit",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const spec = await response.json();
    
    // Ensure cursor directory exists
    const cursorDir = path.join(process.cwd(), '.cursor/docs');
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir);
    }

    // Write the spec to file
    fs.writeFileSync(
      path.join(cursorDir, 'backend-openapi.json'),
      JSON.stringify(spec, null, 2)
    );

    console.log('✅ Successfully fetched and stored OpenAPI spec');
  } catch (error) {
    console.error('❌ Error fetching OpenAPI spec:', error);
    process.exit(1);
  }
}

void fetchOpenAPISpec(); 