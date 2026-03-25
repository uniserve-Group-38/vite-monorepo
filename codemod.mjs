import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function codemod(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace next/link with react-router-dom Link
  content = content.replace(/import Link from ["']next\/link["']/g, 'import { Link } from "react-router-dom"');
  content = content.replace(/<Link href=/g, '<Link to=');

  // Replace next/image with img tag
  content = content.replace(/import Image from ["']next\/image["']/g, '');
  content = content.replace(/<Image\s/g, '<img ');
  content = content.replace(/<\/Image>/g, '</img>');

  // Replace Next.js router hooks
  content = content.replace(/import {([^}]+)} from ["']next\/navigation["']/g, (match, imports) => {
    let newImports = [];
    if (imports.includes('useRouter')) newImports.push('useNavigate');
    if (imports.includes('usePathname')) newImports.push('useLocation');
    if (imports.includes('useSearchParams')) newImports.push('useSearchParams');
    if (newImports.length > 0) {
      return `import { ${newImports.join(', ')} } from "react-router-dom"`;
    }
    return '';
  });

  // Common replacements for hook usages
  content = content.replace(/const router = useRouter\(\)/g, 'const navigate = useNavigate()');
  content = content.replace(/router\.push\(/g, 'navigate(');
  content = content.replace(/router\.replace\(/g, 'navigate(');
  content = content.replace(/router\.back\(\)/g, 'navigate(-1)');
  content = content.replace(/const pathname = usePathname\(\)/g, 'const { pathname } = useLocation()');

  // Prefix /api/ fetch calls with Vite Env URL
  // Matches fetch('/api/...') or fetch(`/api/...`) but avoids import or type strings
  content = content.replace(/fetch\(['"`]\/api\//g, 'fetch(import.meta.env.VITE_API_URL + \'/api/');
  content = content.replace(/axios\.post\(['"`]\/api\//g, 'axios.post(import.meta.env.VITE_API_URL + \'/api/');
  content = content.replace(/axios\.get\(['"`]\/api\//g, 'axios.get(import.meta.env.VITE_API_URL + \'/api/');
  content = content.replace(/axios\.delete\(['"`]\/api\//g, 'axios.delete(import.meta.env.VITE_API_URL + \'/api/');
  content = content.replace(/axios\.put\(['"`]\/api\//g, 'axios.put(import.meta.env.VITE_API_URL + \'/api/');
  content = content.replace(/axios\.patch\(['"`]\/api\//g, 'axios.patch(import.meta.env.VITE_API_URL + \'/api/');

  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir(path.join(process.cwd(), 'packages/frontend/src/pages'), codemod);
walkDir(path.join(process.cwd(), 'packages/frontend/src/components'), codemod);
walkDir(path.join(process.cwd(), 'packages/frontend/src/lib'), codemod);
walkDir(path.join(process.cwd(), 'packages/frontend/src/hooks'), codemod);

console.log("Codemod complete.");
