import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'packages/frontend/src/pages');
const routes = [];

function walk(dir, routePrefix = '') {
  let files = fs.readdirSync(dir);
  for (let f of files) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      // It's a directory like `dashboard`, check for brackets
      let segment = f.replace(/\[([^\]]+)\]/g, ':$1');
      walk(p, routePrefix + '/' + segment);
    } else if (f === 'page.tsx') {
      let routePath = routePrefix === '' ? '/' : routePrefix;
      // Convert Windows paths and generate import name
      let importPath = path.relative(path.join(process.cwd(), 'packages/frontend/src'), p).replace(/\\/g, '/');
      let componentName = 'Page_' + importPath.replace(/[^a-zA-Z0-9]/g, '_');
      routes.push({ path: routePath, importPath, componentName });
    }
  }
}

walk(pagesDir);

// Generate App.tsx
let imports = `import React, { Suspense } from 'react';\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\n`;
imports += `import { Toaster } from "@/components/ui/sonner";\n`;
imports += `import BetterAuthUIProvider from "@/providers/better-auth-ui-provider";\n`;
imports += `import { ThemeProvider } from "@/components/theme-provider";\n`;

let routeElements = '';

for (const route of routes) {
  // Use React.lazy to avoid massive bundle and circular dep issues during migration
  imports += `const ${route.componentName} = React.lazy(() => import('@/${route.importPath}'));\n`;
  routeElements += `            <Route path="${route.path}" element={<${route.componentName} />} />\n`;
}

const appTsx = `${imports}

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <BetterAuthUIProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <Routes>
${routeElements}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </BetterAuthUIProvider>
      <Toaster />
    </ThemeProvider>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'packages/frontend/src/App.tsx'), appTsx, 'utf8');
console.log("App.tsx dynamically generated with", routes.length, "routes.");
