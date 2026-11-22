# Workflow UI Codebase Documentation (Overhauled)

This document contains the complete codebase and structure of the `workflow-ui` React application which acts as the interactive visual explorer for the AMS Spring Boot backend.

## File Tree Structure

```text
workflow-ui/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── App.css
    ├── lib/
    │   └── utils.ts
    ├── components/
    │   ├── flow/
    │   │   └── NeoNode.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       └── Card.tsx
    ├── data/
    │   ├── architecture.ts
    │   └── database.tsx
    └── views/
        ├── ArchitectureView.tsx
        ├── ApiExplorerView.tsx
        └── DbExplorerView.tsx
```

---

## Configuration & Root Files

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>workflow-ui</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `package.json`
```json
{
  "name": "workflow-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.1",
    "@xyflow/react": "^12.11.0",
    "clsx": "^2.1.1",
    "d3": "^7.9.0",
    "framer-motion": "^12.40.0",
    "lucide-react": "^1.20.0",
    "mermaid": "^11.15.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.18.0",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/d3": "^7.4.3",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "postcss": "^8.5.15",
    "tailwindcss": "^4.3.1",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
}
```

### `tsconfig.json`
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

---

## Source Directory (`src/`)

### `src/main.tsx`
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### `src/App.tsx`
```typescript
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { Network, FileJson, Database } from "lucide-react"
import { cn } from "./lib/utils"

function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { name: "Architecture Flow", path: "/", icon: <Network size={20} /> },
    { name: "API & Exceptions", path: "/api", icon: <FileJson size={20} /> },
    { name: "Data Model (ER)", path: "/db", icon: <Database size={20} /> },
  ]

  return (
    <div className="w-64 min-h-screen border-r-3 border-black bg-neo-yellow p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-black tracking-tight border-b-3 border-black pb-4">
          AMS EXPLORER
        </h1>
      </div>
      
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-bold border-3 border-black rounded-sm transition-all",
                isActive 
                  ? "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
                  : "bg-cream hover:bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t-3 border-black font-bold text-sm">
        <p>Spring Boot 3.2</p>
        <p>Java 17 + MySQL</p>
      </div>
    </div>
  )
}

import { ArchitectureView } from "./views/ArchitectureView"
import { ApiExplorerView } from "./views/ApiExplorerView"
import { DbExplorerView } from "./views/DbExplorerView"

function App() {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<ArchitectureView />} />
            <Route path="/api" element={<ApiExplorerView />} />
            <Route path="/db" element={<DbExplorerView />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
```

### `src/index.css`
```css
@import "tailwindcss";

@theme {
  --color-cream: #f4f1ea;
  --color-cream-light: #fdfbf7;
  --color-cream-dark: #e8e4d9;
  
  --color-neo-blue: #3b82f6;
  --color-neo-red: #ef4444;
  --color-neo-yellow: #fbbf24;
  --color-neo-green: #10b981;
  --color-neo-purple: #8b5cf6;
  --color-neo-pink: #ec4899;
  --color-neo-orange: #f97316;

  --shadow-neo: 4px 4px 0px 0px rgba(0,0,0,1);
  --shadow-neo-sm: 2px 2px 0px 0px rgba(0,0,0,1);
  --shadow-neo-lg: 8px 8px 0px 0px rgba(0,0,0,1);
}

@layer base {
  body {
    background-color: var(--color-cream);
    color: #000;
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  ::selection {
    background-color: var(--color-neo-yellow);
    color: #000;
  }
}
```

### `src/App.css`
```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
```

---

## Utilities (`src/lib/`)

### `src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Custom Shared Components (`src/components/`)

### `src/components/flow/NeoNode.tsx`
```typescript
import { Handle, Position } from '@xyflow/react'
import { cn } from '../../lib/utils'

interface NeoNodeProps {
  data: {
    label: string
    color?: string
    icon?: React.ReactNode
    isLayer?: boolean
    desc?: string
  }
  isConnectable: boolean
}

export function NeoNode({ data, isConnectable }: NeoNodeProps) {
  if (data.isLayer) {
    return (
      <div className="w-full h-full border-3 border-black border-dashed bg-transparent rounded-sm p-4 relative pointer-events-none">
        <div className="absolute -top-4 left-4 bg-cream border-3 border-black px-3 py-1 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {data.label}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "px-4 py-3 border-3 border-black rounded-sm bg-white min-w-[180px] max-w-[280px]",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        data.color
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 border-2 border-black bg-white"
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-2 font-black justify-center text-sm">
          {data.icon}
          <span>{data.label}</span>
        </div>
        {data.desc && (
          <div className="text-[10px] font-medium opacity-80 leading-tight mt-1 whitespace-pre-line text-left w-full">
            {data.desc}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 border-2 border-black bg-white"
      />
    </div>
  )
}
```

### `src/components/ui/Button.tsx`
```typescript
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all border-3 border-black rounded-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          {
            "bg-neo-yellow text-black hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]": variant === "default",
            "bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]": variant === "outline",
            "bg-transparent border-transparent hover:bg-gray-200 active:translate-x-0 active:translate-y-0": variant === "ghost",
            "bg-neo-red text-white hover:bg-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]": variant === "danger",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### `src/components/ui/Card.tsx`
```typescript
import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "interactive"
  color?: "cream" | "white" | "blue" | "yellow" | "pink" | "green"
}

const colorStyles = {
  cream: "bg-cream-light",
  white: "bg-white",
  blue: "bg-neo-blue text-white",
  yellow: "bg-neo-yellow text-black",
  pink: "bg-neo-pink text-white",
  green: "bg-neo-green text-black",
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", color = "white", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-3 border-black rounded-sm p-4",
          colorStyles[color],
          {
            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]": variant === "default",
            "shadow-none": variant === "flat",
            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer": variant === "interactive",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"
```

---

## Data Configurations (`src/data/`)

### `src/data/architecture.ts`
```typescript
import type { Edge, Node } from "@xyflow/react"

export const initialNodes: Node[] = [
  // Layers
  { id: "layer-client", type: "neoNode", data: { label: "Client Layer", isLayer: true }, position: { x: 400, y: 0 }, style: { width: 600, height: 120 } },
  { id: "layer-security", type: "neoNode", data: { label: "Spring Security Filter Chain", isLayer: true }, position: { x: 150, y: 150 }, style: { width: 1100, height: 160 } },
  { id: "layer-web", type: "neoNode", data: { label: "Web Layer (Spring MVC & REST Controllers)", isLayer: true }, position: { x: 50, y: 350 }, style: { width: 1300, height: 220 } },
  { id: "layer-service", type: "neoNode", data: { label: "Service Layer (@Service & @Transactional)", isLayer: true }, position: { x: 50, y: 620 }, style: { width: 1300, height: 180 } },
  { id: "layer-data", type: "neoNode", data: { label: "Persistence Layer (Spring Data JPA & Hibernate)", isLayer: true }, position: { x: 200, y: 850 }, style: { width: 1150, height: 220 } },
  { id: "layer-db", type: "neoNode", data: { label: "Database (MySQL)", isLayer: true }, position: { x: 350, y: 1120 }, style: { width: 850, height: 200 } },

  // Client
  { id: "client", type: "neoNode", data: { label: "HTTP Client", color: "bg-neo-blue text-white", desc: "Browser / Mobile App\nSends REST requests with JWT" }, position: { x: 620, y: 30 } },

  // Security
  { id: "jwt-filter", type: "neoNode", data: { label: "JwtAuthenticationFilter", color: "bg-neo-yellow text-black", desc: "OncePerRequestFilter\nExtracts & validates Bearer token" }, position: { x: 620, y: 200 } },
  { id: "jwt-svc", type: "neoNode", data: { label: "JwtService", color: "bg-neo-purple text-white", desc: "JJWT Library\nHS256 Signing & Parsing" }, position: { x: 250, y: 200 } },
  
  // Web
  { id: "dispatcher", type: "neoNode", data: { label: "DispatcherServlet", color: "bg-gray-200 text-black", desc: "Front Controller\nRoutes to @RestController" }, position: { x: 620, y: 400 } },
  { id: "auth-ctrl", type: "neoNode", data: { label: "AuthController", color: "bg-neo-green text-black", desc: "/api/v1/auth/**\nLogin & Register" }, position: { x: 300, y: 480 } },
  { id: "asset-ctrl", type: "neoNode", data: { label: "AssetController", color: "bg-neo-green text-black", desc: "/api/v1/assets\nCRUD & Search" }, position: { x: 900, y: 480 } },
  { id: "exception-handler", type: "neoNode", data: { label: "GlobalExceptionHandler", color: "bg-neo-red text-white", desc: "@RestControllerAdvice\nCatches exceptions -> ApiResponse" }, position: { x: 1150, y: 400 } },

  // Service
  { id: "auth-svc", type: "neoNode", data: { label: "AuthService Logic", color: "bg-neo-pink text-white", desc: "AuthenticationManager\nPassword Encoding" }, position: { x: 300, y: 680 } },
  { id: "asset-svc", type: "neoNode", data: { label: "AssetService", color: "bg-neo-pink text-white", desc: "@Transactional\nValidation & Mapping" }, position: { x: 900, y: 680 } },

  // Data
  { id: "user-repo", type: "neoNode", data: { label: "UserRepository", color: "bg-neo-orange text-white", desc: "JpaRepository<User, String>\nfindByEmail()" }, position: { x: 300, y: 920 } },
  { id: "asset-repo", type: "neoNode", data: { label: "AssetRepository", color: "bg-neo-orange text-white", desc: "JpaRepository\nJpaSpecificationExecutor" }, position: { x: 800, y: 920 } },
  { id: "hibernate", type: "neoNode", data: { label: "Hibernate Interceptors", color: "bg-black text-white", desc: "@SQLDelete (Soft Delete)\n@Where (is_deleted=false)" }, position: { x: 1100, y: 920 } },

  // DB
  { id: "mysql", type: "neoNode", data: { label: "MySQL (ams_db)", color: "bg-neo-blue text-white", desc: "Relational DB\nHikariCP Connection Pool" }, position: { x: 650, y: 1180 } },
  { id: "table-users", type: "neoNode", data: { label: "Table: users", color: "bg-white text-black", desc: "Stores User entities" }, position: { x: 450, y: 1260 } },
  { id: "table-assets", type: "neoNode", data: { label: "Table: assets", color: "bg-white text-black", desc: "Stores Asset entities" }, position: { x: 850, y: 1260 } },
]

export const initialEdges: Edge[] = [
  { id: "e1", source: "client", target: "jwt-filter", animated: true, label: "HTTP Request" },
  { id: "e2", source: "jwt-svc", target: "jwt-filter", animated: true, type: "smoothstep", label: "Validate" },
  { id: "e3", source: "jwt-filter", target: "dispatcher", animated: true, label: "SecurityContext" },
  { id: "e4", source: "dispatcher", target: "auth-ctrl", animated: true },
  { id: "e5", source: "dispatcher", target: "asset-ctrl", animated: true },
  { id: "e6", source: "auth-ctrl", target: "exception-handler", type: "smoothstep", label: "Throws", style: { stroke: '#ef4444', strokeDasharray: '5,5' } },
  { id: "e7", source: "asset-ctrl", target: "exception-handler", type: "smoothstep", label: "Throws", style: { stroke: '#ef4444', strokeDasharray: '5,5' } },
  { id: "e8", source: "auth-ctrl", target: "auth-svc", animated: true },
  { id: "e9", source: "asset-ctrl", target: "asset-svc", animated: true },
  { id: "e10", source: "auth-svc", target: "jwt-svc", animated: true, type: "smoothstep", label: "Generate Token" },
  { id: "e11", source: "auth-svc", target: "user-repo", animated: true },
  { id: "e12", source: "asset-svc", target: "asset-repo", animated: true },
  { id: "e13", source: "asset-repo", target: "hibernate", animated: true, label: "Delete/Find" },
  { id: "e14", source: "user-repo", target: "mysql", animated: true },
  { id: "e15", source: "hibernate", target: "mysql", animated: true, label: "UPDATE (Soft Delete)" },
  { id: "e16", source: "mysql", target: "table-users" },
  { id: "e17", source: "mysql", target: "table-assets" },
]
```

### `src/data/database.tsx`
```typescript
import type { Edge, Node } from "@xyflow/react"

export const dbNodes: Node[] = [
  {
    id: "base-entity",
    type: "neoNode",
    data: { 
      label: "<<MappedSuperclass>> BaseEntity", 
      color: "bg-gray-100 text-black",
      desc: "id (UUID, @Id, @GeneratedValue)\ncreatedAt (@CreationTimestamp)\nupdatedAt (@UpdateTimestamp)\nisDeleted (boolean)\ndeletedAt (LocalDateTime)"
    },
    position: { x: 550, y: 50 },
  },
  {
    id: "user-entity",
    type: "neoNode",
    data: { 
      label: "@Entity User", 
      color: "bg-neo-blue text-white",
      desc: "email (String, @Email, Unique)\npassword (String, BCrypt)\nrole (String)\nfullName (String)\n\nImplements UserDetails"
    },
    position: { x: 250, y: 350 },
  },
  {
    id: "asset-entity",
    type: "neoNode",
    data: { 
      label: "@Entity Asset", 
      color: "bg-neo-yellow text-black",
      desc: "name (String)\nassetType (String)\nserialNumber (String, Unique)\npurchaseDate (LocalDate)\npurchaseCost (BigDecimal)\nwarrantyExpiryDate (LocalDate)\nstatus (@Enumerated)\nqrCode (String, Unique)"
    },
    position: { x: 850, y: 350 },
  },
  {
    id: "asset-status-enum",
    type: "neoNode",
    data: { 
      label: "<<Enum>> AssetStatus", 
      color: "bg-neo-purple text-white",
      desc: "AVAILABLE\nIN_USE\nUNDER_REPAIR\nDISPOSED"
    },
    position: { x: 1200, y: 350 },
  },
  {
    id: "hibernate-annotations",
    type: "neoNode",
    data: {
      label: "Hibernate Soft Delete",
      color: "bg-neo-red text-white",
      desc: "@SQLDelete\nUPDATE assets SET is_deleted=true...\n\n@Where(clause=\"is_deleted=false\")"
    },
    position: { x: 850, y: 650 },
  }
]

export const dbEdges: Edge[] = [
  {
    id: "e-base-user",
    source: "base-entity",
    target: "user-entity",
    animated: false,
    label: "extends",
    type: "smoothstep",
    style: { strokeWidth: 3, stroke: '#000' }
  },
  {
    id: "e-base-asset",
    source: "base-entity",
    target: "asset-entity",
    animated: false,
    label: "extends",
    type: "smoothstep",
    style: { strokeWidth: 3, stroke: '#000' }
  },
  {
    id: "e-asset-status",
    source: "asset-entity",
    target: "asset-status-enum",
    animated: false,
    label: "uses",
    type: "smoothstep",
    style: { strokeWidth: 2, stroke: '#8b5cf6', strokeDasharray: '5,5' }
  },
  {
    id: "e-asset-hibernate",
    source: "asset-entity",
    target: "hibernate-annotations",
    animated: true,
    label: "Intercepted by",
    type: "smoothstep",
    style: { strokeWidth: 3, stroke: '#ef4444' }
  }
]

export const tableDetails: Record<string, any> = {
  "base-entity": {
    name: "BaseEntity",
    type: "MappedSuperclass",
    description: "Provides common auditing and soft-delete fields for all entities in the system.",
    fields: [
      { name: "id", type: "String (UUID)", annotation: "@Id @GeneratedValue @UuidGenerator", desc: "Primary Key" },
      { name: "createdAt", type: "LocalDateTime", annotation: "@CreationTimestamp", desc: "Audit field" },
      { name: "updatedAt", type: "LocalDateTime", annotation: "@UpdateTimestamp", desc: "Audit field" },
      { name: "isDeleted", type: "boolean", annotation: "@Column", desc: "Soft delete flag" },
      { name: "deletedAt", type: "LocalDateTime", annotation: "@Column", desc: "Timestamp of deletion" }
    ]
  },
  "user-entity": {
    name: "User",
    type: "Entity",
    description: "Represents system users. Implements Spring Security's UserDetails for authentication.",
    fields: [
      { name: "email", type: "String", annotation: "@NotBlank @Email @Column(unique=true)", desc: "Username / Email" },
      { name: "password", type: "String", annotation: "@NotBlank", desc: "BCrypt hashed password" },
      { name: "role", type: "String", annotation: "@NotBlank", desc: "User role (e.g., EMPLOYEE)" },
      { name: "fullName", type: "String", annotation: "@NotBlank", desc: "User's full name" }
    ]
  },
  "asset-entity": {
    name: "Asset",
    type: "Entity",
    description: "Represents physical IT assets. Uses Hibernate annotations to enforce soft-deletion at the database level.",
    fields: [
      { name: "name", type: "String", annotation: "@NotBlank", desc: "Asset name" },
      { name: "assetType", type: "String", annotation: "@NotBlank", desc: "Category of asset" },
      { name: "serialNumber", type: "String", annotation: "@NotBlank @Column(unique=true)", desc: "Manufacturer serial" },
      { name: "purchaseDate", type: "LocalDate", annotation: "@NotNull", desc: "Date of purchase" },
      { name: "purchaseCost", type: "BigDecimal", annotation: "@NotNull @DecimalMin", desc: "Financial cost" },
      { name: "warrantyExpiryDate", type: "LocalDate", annotation: "@Column", desc: "Warranty end date" },
      { name: "status", type: "AssetStatus", annotation: "@Enumerated(EnumType.STRING)", desc: "Lifecycle status" },
      { name: "qrCode", type: "String", annotation: "@NotBlank @Column(unique=true)", desc: "Internal QR identifier" }
    ]
  }
}
```

---

## Views (`src/views/`)

### `src/views/ArchitectureView.tsx`
```typescript
import { useState, useCallback } from "react"
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState
} from "@xyflow/react"
import '@xyflow/react/dist/style.css'
import { NeoNode } from "../components/flow/NeoNode"
import { initialNodes, initialEdges } from "../data/architecture"
import { Card } from "../components/ui/Card"
import { X } from "lucide-react"

const nodeTypes = {
  neoNode: NeoNode,
}

export function ArchitectureView() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null)

  const onNodeClick = useCallback((_event: any, node: any) => {
    if (!node.data.isLayer) {
      setSelectedNode(node)
    }
  }, [])

  return (
    <div className="h-[calc(100vh-2rem)] p-4 flex gap-4">
      <Card className="flex-1 h-full p-0 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-3xl font-black bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Spring Boot Architecture Flow
          </h2>
        </div>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-cream-dark"
        >
          <Background gap={20} size={2} color="#000" />
          <Controls className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white fill-black" />
        </ReactFlow>
      </Card>

      {selectedNode && (
        <Card className="w-[400px] h-full overflow-y-auto flex flex-col relative bg-white animate-in slide-in-from-right-8 duration-300">
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black rounded-sm transition-all"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-black mb-4 border-b-3 border-black pb-2 pr-8">
            {selectedNode.data.label}
          </h3>
          
          <div className="space-y-4 text-sm font-medium">
            <div>
              <h4 className="font-black text-neo-blue mb-1 uppercase tracking-wider">Backend Component</h4>
              <p className="font-mono bg-cream p-2 border-2 border-black rounded-sm">{selectedNode.data.label}</p>
            </div>
            
            <div>
              <h4 className="font-black text-neo-pink mb-1 uppercase tracking-wider">Flow Responsibility</h4>
              <p className="whitespace-pre-line">{selectedNode.data.desc || "Core architectural component handling specific domain logic within the Spring Boot lifecycle."}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
```

### `src/views/DbExplorerView.tsx`
```typescript
import { useState, useCallback } from "react"
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState
} from "@xyflow/react"
import { NeoNode } from "../components/flow/NeoNode"
import { dbNodes, dbEdges, tableDetails } from "../data/database"
import { Card } from "../components/ui/Card"
import { X } from "lucide-react"

const nodeTypes = {
  neoNode: NeoNode,
}

export function DbExplorerView() {
  const [nodes, , onNodesChange] = useNodesState(dbNodes)
  const [edges, , onEdgesChange] = useEdgesState(dbEdges)
  
  const [selectedTableId, setSelectedTableId] = useState<string | null>("base-entity")

  const onNodeClick = useCallback((_event: any, node: any) => {
    setSelectedTableId(node.id)
  }, [])

  const selectedTable = selectedTableId ? tableDetails[selectedTableId] : null

  return (
    <div className="h-[calc(100vh-2rem)] p-4 flex flex-col gap-4">
      <div className="flex-1 flex gap-4">
        <Card className="flex-1 h-full p-0 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-3xl font-black bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Entity Relationship & Hibernate mappings
            </h2>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-cream-dark"
          >
            <Background gap={20} size={2} color="#000" />
            <Controls className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white fill-black" />
          </ReactFlow>
        </Card>

        {selectedTable && (
          <Card className="w-[500px] h-full overflow-y-auto flex flex-col relative bg-white">
            <button 
              onClick={() => setSelectedTableId(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black rounded-sm transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4 border-b-3 border-black pb-4 pr-8">
              <span className="font-mono text-sm font-black bg-neo-yellow px-2 py-1 border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{selectedTable.type}</span>
              <h3 className="text-3xl font-black">{selectedTable.name}</h3>
            </div>

            <p className="font-bold text-gray-700 mb-6">{selectedTable.description}</p>
            
            <h4 className="font-black text-xl mb-3 uppercase bg-neo-blue text-white px-2 py-1 border-3 border-black inline-block">Fields & Annotations</h4>
            
            <div className="space-y-3">
              {selectedTable.fields.map((field: any) => (
                <div key={field.name} className="p-3 border-3 border-black rounded-sm bg-cream-light hover:bg-cream transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-mono text-base">{field.name}</span>
                    <span className="text-xs font-black text-white bg-black px-2 py-0.5 rounded-sm ml-auto">
                      {field.type}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neo-purple mb-1">{field.annotation}</div>
                  {field.desc && <p className="text-sm text-gray-600 font-medium">{field.desc}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
```

### `src/views/ApiExplorerView.tsx`
```typescript
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Play, AlertTriangle } from "lucide-react"

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/auth/register",
    description: "Register a new user account.",
    color: "bg-neo-blue text-white",
    controller: "AuthController",
    service: "UserRepository / PasswordEncoder",
    body: { email: "john@example.com", password: "securePassword123!", fullName: "John Doe", role: "EMPLOYEE" },
    response: { success: true, message: "User registered successfully", data: { token: "eyJhbG...", email: "john@example.com", role: "EMPLOYEE" } },
    exceptions: ["DataIntegrityViolationException (409)"]
  },
  {
    method: "POST",
    path: "/api/v1/assets",
    description: "Create a new asset in the system.",
    color: "bg-neo-yellow text-black",
    controller: "AssetController",
    service: "AssetService (@Transactional)",
    headers: { Authorization: "Bearer <token>" },
    body: { name: "MacBook Pro", assetType: "Laptop", serialNumber: "SN-MBP-001", purchaseDate: "2024-03-10", purchaseCost: 1200.00 },
    response: { success: true, message: "Asset created successfully", data: { id: "uuid", name: "MacBook Pro", status: "AVAILABLE", qrCode: "AMS-12345678" } },
    exceptions: ["MethodArgumentNotValidException (400)", "DuplicateResourceException (409)"]
  },
  {
    method: "GET",
    path: "/api/v1/assets",
    description: "Fetch all assets with pagination & filtering.",
    color: "bg-neo-blue text-white",
    controller: "AssetController",
    service: "AssetService (readOnly)",
    headers: { Authorization: "Bearer <token>" },
    queryParams: "?page=0&size=20&status=AVAILABLE",
    response: { success: true, message: "Assets retrieved successfully", data: { content: [{ id: "uuid", name: "MacBook Pro" }], totalElements: 1, totalPages: 1 } },
    exceptions: []
  },
  {
    method: "DELETE",
    path: "/api/v1/assets/{id}",
    description: "Soft delete an asset (triggers Hibernate @SQLDelete).",
    color: "bg-neo-red text-white",
    controller: "AssetController",
    service: "AssetService (@Transactional)",
    headers: { Authorization: "Bearer <token>" },
    pathParams: "id: UUID of the asset",
    response: { success: true, message: "Asset deleted successfully", data: null },
    exceptions: ["ResourceNotFoundException (404)"]
  }
]

export function ApiExplorerView() {
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0])
  const [responseState, setResponseState] = useState<"idle" | "loading" | "success">("idle")

  const handleSimulate = () => {
    setResponseState("loading")
    setTimeout(() => setResponseState("success"), 800)
  }

  return (
    <div className="h-[calc(100vh-2rem)] p-4 flex gap-6">
      <Card className="w-1/3 h-full overflow-y-auto flex flex-col gap-3">
        <h2 className="text-2xl font-black mb-2 pb-2 border-b-3 border-black">API Endpoints</h2>
        
        {endpoints.map((ep) => (
          <div 
            key={ep.path + ep.method}
            onClick={() => { setActiveEndpoint(ep); setResponseState("idle") }}
            className={`p-3 border-3 border-black rounded-sm cursor-pointer transition-all ${activeEndpoint === ep ? 'bg-cream-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-black text-xs px-2 py-1 border-2 border-black ${ep.color}`}>{ep.method}</span>
              <span className="font-bold text-sm truncate">{ep.path}</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1">{ep.description}</p>
          </div>
        ))}
      </Card>

      <Card className="flex-1 h-full overflow-y-auto bg-white flex flex-col">
        <div className="flex items-start justify-between border-b-3 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`font-black text-sm px-3 py-1 border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${activeEndpoint.color}`}>{activeEndpoint.method}</span>
              <h1 className="text-3xl font-black">{activeEndpoint.path}</h1>
            </div>
            <p className="text-lg font-medium">{activeEndpoint.description}</p>
            <div className="flex gap-4 mt-2 text-xs font-mono font-bold">
              <span className="bg-neo-green text-white px-2 py-1 border-2 border-black">{activeEndpoint.controller}</span>
              <span className="bg-neo-pink text-white px-2 py-1 border-2 border-black">{activeEndpoint.service}</span>
            </div>
          </div>
          <Button onClick={handleSimulate} className="gap-2">
            <Play size={16} /> Simulate Request
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-black bg-neo-yellow px-2 py-1 border-3 border-black inline-block self-start">Request</h3>
            {activeEndpoint.headers && <pre className="bg-cream p-2 border-3 border-black text-sm">{JSON.stringify(activeEndpoint.headers, null, 2)}</pre>}
            {activeEndpoint.queryParams && <pre className="bg-cream p-2 border-3 border-black text-sm">{activeEndpoint.queryParams}</pre>}
            {activeEndpoint.body && (
              <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-sm mb-1 uppercase">Body (DTO Validation via @Valid)</h4>
                <pre className="flex-1 bg-[#1E1E1E] text-[#D4D4D4] p-3 border-3 border-black text-sm font-mono overflow-auto">
                  {JSON.stringify(activeEndpoint.body, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-black bg-neo-green px-2 py-1 border-3 border-black inline-block self-start text-black">Response / Exceptions</h3>
            
            {activeEndpoint.exceptions.length > 0 && (
              <div className="p-3 border-3 border-neo-red bg-red-50 rounded-sm">
                <h4 className="font-bold text-sm mb-1 uppercase text-neo-red flex items-center gap-1"><AlertTriangle size={14}/> GlobalExceptionHandler Catches:</h4>
                <ul className="text-xs font-mono space-y-1">
                  {activeEndpoint.exceptions.map((ex, i) => <li key={i}>• {ex}</li>)}
                </ul>
              </div>
            )}

            <div className="flex-1 border-3 border-black bg-[#1E1E1E] flex flex-col relative">
              {responseState === "idle" && <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">Click 'Simulate Request' to view ApiResponse wrapper</div>}
              {responseState === "loading" && <div className="absolute inset-0 flex items-center justify-center text-neo-yellow font-black animate-pulse">Processing via @Transactional...</div>}
              {responseState === "success" && (
                <div className="p-3 text-sm font-mono overflow-auto animate-in fade-in duration-300">
                  <div className="text-neo-green font-bold mb-2">HTTP/1.1 200 OK (ApiResponse Wrapper)</div>
                  <pre className="text-[#D4D4D4]">{JSON.stringify(activeEndpoint.response, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
```
