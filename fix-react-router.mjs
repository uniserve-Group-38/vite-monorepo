import fs from 'fs';
import path from 'path';

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if(fs.statSync(p).isDirectory()) {
      walk(p);
    } else if(p.endsWith('.tsx') || p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      let original = c;

      // 1. Link href -> to
      c = c.replace(/<Link([^>]*?)href=/g, '<Link$1to=');
      
      // 2. img fill -> (remove)
      c = c.replace(/<img([^>]*)fill(\={true})?([^>]*)\/?>/g, '<img$1$3 />');

      // 3. Page Params Next.js -> React Router useParams
      // Many Next.js pages export default function Page({ params }: { params: Promise<{ id: string }> })
      // Or export default async function Page({ params, searchParams }: PageProps)
      // We can't perfectly regex all variations, but we can catch the most common ones.
      // Easiest is to add import { useParams } from 'react-router-dom' inside the file if needed.
      if (p.includes('src\\pages') || p.includes('src/pages')) {
          if (c.includes('params') && !c.includes('useParams')) {
              if (c.includes('export default function')) {
                  // Prepend import if missing
                  if (!c.includes("import { useParams }")) {
                      c = `import { useParams } from "react-router-dom";\n${c}`;
                  }
              }
          }
          // Remove Next.js metadata and viewport exports
          c = c.replace(/export const metadata[^{]*\{[^}]*\};/g, '');
          c = c.replace(/export const viewport[^{]*\{[^}]*\};/g, '');
      }

      // 4. Clean up Next.js redirects/notfounds
      // Replace redirect('/foo') -> window.location.href = '/foo' for simplicity right now
      c = c.replace(/redirect\(([^)]+)\)/g, 'window.location.href = $1');
      c = c.replace(/notFound\(\)/g, 'window.location.href = "/404"');
      
      // 5. Remove "use server"
      c = c.replace(/"use server";?/g, '');
      c = c.replace(/'use server';?/g, '');

      if(c !== original) {
        fs.writeFileSync(p, c, 'utf8');
      }
    }
  });
}

walk('packages/frontend/src');
console.log('React Router fix complete.');
