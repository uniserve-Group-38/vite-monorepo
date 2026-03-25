import fs from 'fs';
import path from 'path';

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if(fs.statSync(p).isDirectory()) {
      walk(p);
    } else if(p.endsWith('.tsx') || p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      const regex = /import\.meta\.env\.VITE_API_URL \+ '\/api\/([^"'`]*?)["'`]/g;
      let r = c.replace(regex, 'import.meta.env.VITE_API_URL + `/api/$1`');
      if(c !== r) {
        fs.writeFileSync(p, r, 'utf8');
        console.log(`Fixed quotes in ${p}`);
      }
    }
  });
}

walk('packages/frontend/src');
console.log('Fix complete.');
