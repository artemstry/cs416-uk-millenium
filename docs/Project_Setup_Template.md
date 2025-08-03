# Project Setup Template
## UK Millennium Macroeconomic Data Narrative Visualization

### 1. Repository Structure

```
uk-economic-millennium-story/
├── README.md
├── index.html                 # Main entry point
├── package.json              # Dependencies and scripts
├── .gitignore               # Git ignore rules
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
├── src/
│   ├── js/
│   │   ├── main.js          # Main application entry
│   │   ├── data/
│   │   │   ├── dataLoader.js     # Data loading utilities
│   │   │   ├── dataProcessor.js  # Data processing functions
│   │   │   └── constants.js      # Data constants
│   │   ├── scenes/
│   │   │   ├── sceneManager.js   # Scene management
│   │   │   ├── scene1.js         # Historical Overview
│   │   │   ├── scene2.js         # Crisis Periods
│   │   │   ├── scene3.js         # Modern Era
│   │   │   └── sceneExploration.js # Interactive Exploration
│   │   ├── components/
│   │   │   ├── annotations.js    # Annotation system
│   │   │   ├── navigation.js     # Navigation controls
│   │   │   ├── tooltips.js       # Tooltip system
│   │   │   └── legends.js        # Legend components
│   │   ├── utils/
│   │   │   ├── d3Helpers.js      # D3 utility functions
│   │   │   ├── formatters.js     # Data formatters
│   │   │   ├── scales.js         # D3 scales setup
│   │   │   └── transitions.js    # Animation utilities
│   │   └── config/
│   │       ├── visualConfig.js   # Visual styling config
│   │       └── narrativeConfig.js # Narrative structure config
│   ├── css/
│   │   ├── styles.css           # Main stylesheet
│   │   ├── components.css       # Component-specific styles
│   │   └── responsive.css       # Responsive design
│   └── data/
│       ├── processed/           # Processed data files
│       └── raw/                 # Raw CSV files from Kaggle
├── tests/
│   ├── unit/
│   │   ├── data.test.js         # Data processing tests
│   │   ├── scenes.test.js       # Scene rendering tests
│   │   ├── components.test.js   # Component tests
│   │   └── utils.test.js        # Utility function tests
│   ├── integration/
│   │   ├── navigation.test.js   # Navigation flow tests
│   │   ├── interactions.test.js # User interaction tests
│   │   └── rendering.test.js    # Full rendering tests
│   ├── e2e/
│   │   ├── userJourney.spec.js  # Complete user journey
│   │   ├── accessibility.spec.js # Accessibility tests
│   │   └── performance.spec.js  # Performance tests
│   └── fixtures/
│       └── mockData.js          # Test data
├── docs/
│   ├── PRD.md                   # Product Requirements Document
│   ├── TDD_Specifications.md   # Testing specifications
│   ├── ESSAY.md                 # Required academic essay
│   └── API.md                   # Code documentation
└── dist/                        # Built files for deployment
```

### 2. Initial Setup Commands

```bash
# 1. Create repository
git init uk-economic-millennium-story
cd uk-economic-millennium-story

# 2. Setup package.json
npm init -y

# 3. Install dependencies
npm install d3 d3-annotation topojson-client

# 4. Install development dependencies
npm install --save-dev \
  jest \
  cypress \
  @testing-library/jest-dom \
  eslint \
  prettier \
  live-server \
  npm-run-all

# 5. Setup directory structure
mkdir -p src/{js/{data,scenes,components,utils,config},css,data/{raw,processed}}
mkdir -p tests/{unit,integration,e2e,fixtures}
mkdir -p docs dist .github/workflows

# 6. Create initial files
touch index.html src/js/main.js src/css/styles.css
touch tests/unit/data.test.js
touch .gitignore README.md
```

### 3. Package.json Configuration

```json
{
  "name": "uk-economic-millennium-story",
  "version": "1.0.0",
  "description": "Interactive narrative visualization of UK's millennium of macroeconomic data",
  "main": "src/js/main.js",
  "scripts": {
    "start": "live-server --port=3000 --open=/index.html",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress open",
    "test:e2e:ci": "cypress run",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.{js,css,html}\"",
    "build": "npm run lint && npm run test && npm run build:dist",
    "build:dist": "cp -r src/* dist/ && cp index.html dist/",
    "deploy": "npm run build && git subtree push --prefix dist origin gh-pages"
  },
  "dependencies": {
    "d3": "^7.8.5",
    "d3-annotation": "^2.5.1",
    "topojson-client": "^3.1.0"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "cypress": "^12.10.0",
    "@testing-library/jest-dom": "^5.16.4",
    "eslint": "^8.40.0",
    "prettier": "^2.8.8",
    "live-server": "^1.2.2",
    "npm-run-all": "^4.1.5"
  }
}
```

### 4. Initial HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UK Economic Millennium Story</title>
    <link rel="stylesheet" href="src/css/styles.css">
    <meta name="description" content="Interactive visualization of UK's millennium of macroeconomic data">
</head>
<body>
    <header>
        <h1>A Millennium of UK Economic History</h1>
        <nav id="scene-navigation" aria-label="Scene navigation">
            <!-- Navigation will be populated by JavaScript -->
        </nav>
    </header>
    
    <main>
        <section id="visualization-container" role="main" aria-live="polite">
            <!-- D3 visualizations will be rendered here -->
        </section>
        
        <aside id="annotation-panel" role="complementary">
            <!-- Annotations and narrative text -->
        </aside>
    </main>
    
    <footer>
        <p>Data source: Bank of England - A Millennium of Macroeconomic Data</p>
    </footer>
    
    <!-- D3 and dependencies -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3-annotation@2.5.1/d3-annotation.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>
    
    <!-- Application scripts -->
    <script src="src/js/main.js" type="module"></script>
</body>
</html>
```

### 5. Basic CSS Framework

```css
/* src/css/styles.css */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fafafa;
}

/* Layout */
header {
    background: #1f4e79;
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

main {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Visualization container */
#visualization-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 2rem;
    min-height: 600px;
}

/* Navigation */
#scene-navigation {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
}

.nav-button {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-button:hover,
.nav-button.active {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
}

/* Annotations */
#annotation-panel {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1.5rem;
    height: fit-content;
}

.annotation {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-left: 4px solid #1f4e79;
    background: #f8f9fa;
}

/* D3 specific styles */
.axis {
    font-size: 12px;
}

.axis-label {
    font-size: 14px;
    font-weight: bold;
}

.line {
    fill: none;
    stroke-width: 2px;
}

.tooltip {
    position: absolute;
    padding: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    font-size: 12px;
    z-index: 1000;
}

/* Responsive design */
@media (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
    
    #scene-navigation {
        flex-wrap: wrap;
    }
}
```

### 6. Basic JavaScript Structure

```javascript
// src/js/main.js

class NarrativeVisualization {
    constructor() {
        this.currentScene = 1;
        this.data = null;
        this.parameters = {
            timeRange: [1000, 2023],
            selectedIndicators: ['gdp', 'inflation', 'population'],
            viewMode: 'absolute'
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadData();
            this.setupNavigation();
            this.renderScene(this.currentScene);
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }
    
    async loadData() {
        // Load and process data
        console.log('Loading data...');
        // Implementation will be added
    }
    
    setupNavigation() {
        // Setup scene navigation
        console.log('Setting up navigation...');
        // Implementation will be added
    }
    
    renderScene(sceneNumber) {
        // Render specific scene
        console.log(`Rendering scene ${sceneNumber}...`);
        // Implementation will be added
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new NarrativeVisualization();
});
```

### 7. Jest Configuration

```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
        'src/js/**/*.js',
        '!src/js/main.js'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

### 8. GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Run e2e tests
      run: npm run test:e2e:ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 9. .gitignore

```
# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local

# Testing
coverage/
cypress/videos/
cypress/screenshots/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

### 10. Next Steps

1. **Setup Repository**: Create GitHub repository and initialize with this structure
2. **Data Analysis**: Analyze the UK macroeconomic dataset to identify key stories
3. **Choose Narrative Structure**: Decide between martini glass, slideshow, or drill-down
4. **Implement Core Scenes**: Start with Scene 1 following TDD approach
5. **Iterate and Test**: Continuous development with testing at each step

---

**Created:** [Current Date]  
**Purpose:** Initial project setup and development template