#!/usr/bin/env node

/**
 * Forward Horizon Marketing - Project Health Check Script
 * 
 * This script verifies critical project information is consistent
 * and up-to-date across all files. Run before major changes.
 * 
 * Usage: node scripts/project-health-check.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Critical information to verify
const CRITICAL_INFO = {
  currentPhone: '(310) 488-5280',
  oldPhone: '(626) 603-0954',
  website: 'https://forwardhorizon.vercel.app',
  mainWebsite: 'https://theforwardhorizon.com',
  serviceAreas: [
    'Los Angeles County',
    'Orange County', 
    'Riverside County',
    'San Bernardino County'
  ]
};

// Files that must exist for proper operation
const REQUIRED_FILES = [
  'CLAUDE_PROJECT_STATUS.md',
  'CLAUDE.md',
  'src/components/ClientAnalytics.tsx',
  'src/components/SEOAnalytics.tsx',
  'src/components/TrackingLink.tsx',
  'src/app/blog/page.tsx',
  'package.json'
];

// Files to check for phone number consistency
const PHONE_CHECK_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  '*.md',
  'public/**/*.json'
];

class ProjectHealthChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '✓',
      'warning': '⚠️',
      'error': '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
  }

  checkRequiredFiles() {
    this.log('Checking required files...', 'info');
    
    REQUIRED_FILES.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        this.log(`Missing required file: ${file}`, 'error');
      } else {
        this.log(`Found: ${file}`, 'info');
      }
    });
  }

  checkPhoneNumbers() {
    this.log('Checking phone number consistency...', 'info');
    
    const allFiles = [];
    PHONE_CHECK_PATTERNS.forEach(pattern => {
      const files = glob.sync(pattern, { cwd: this.projectRoot });
      allFiles.push(...files);
    });

    // Remove duplicates
    const uniqueFiles = [...new Set(allFiles)];
    
    let oldPhoneFound = false;
    let currentPhoneFound = false;

    uniqueFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes(CRITICAL_INFO.oldPhone)) {
          // Check if this is a documentation reference (marked as "REPLACED" or "do not use")
          const line = content.split('\n').find(line => line.includes(CRITICAL_INFO.oldPhone));
          const isDocumentationReference = line && (
            line.toLowerCase().includes('replaced') || 
            line.toLowerCase().includes('do not use') ||
            line.toLowerCase().includes('previous') ||
            line.toLowerCase().includes('old phone')
          );
          
          if (!isDocumentationReference) {
            this.log(`OLD PHONE NUMBER found in: ${file}`, 'error');
            oldPhoneFound = true;
          } else {
            this.log(`Documentation reference to old phone in: ${file} (OK)`, 'info');
          }
        }
        
        if (content.includes(CRITICAL_INFO.currentPhone)) {
          currentPhoneFound = true;
        }
      } catch (error) {
        this.log(`Could not read file: ${file}`, 'warning');
      }
    });

    if (!oldPhoneFound && currentPhoneFound) {
      this.log('Phone numbers are consistent', 'info');
    } else if (oldPhoneFound) {
      this.log('OLD PHONE NUMBERS DETECTED - requires immediate attention', 'error');
    }
  }

  checkStatusDocumentAge() {
    this.log('Checking status document freshness...', 'info');
    
    const statusFile = path.join(this.projectRoot, 'CLAUDE_PROJECT_STATUS.md');
    
    if (fs.existsSync(statusFile)) {
      const stats = fs.statSync(statusFile);
      const lastModified = stats.mtime;
      const daysSinceUpdate = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate > 30) {
        this.log(`Status document is ${Math.round(daysSinceUpdate)} days old - consider updating`, 'warning');
      } else {
        this.log(`Status document is current (${Math.round(daysSinceUpdate)} days old)`, 'info');
      }
    }
  }

  checkPackageJsonIntegrity() {
    this.log('Checking package.json integrity...', 'info');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check for critical dependencies
      const criticalDeps = [
        'next',
        'react',
        'typescript',
        'tailwindcss',
        '@supabase/supabase-js'
      ];
      
      criticalDeps.forEach(dep => {
        if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
          this.log(`Missing critical dependency: ${dep}`, 'warning');
        }
      });
      
      if (packageJson.name && packageJson.version) {
        this.log(`Package: ${packageJson.name}@${packageJson.version}`, 'info');
      }
      
    } catch (error) {
      this.log('Could not parse package.json', 'error');
    }
  }

  checkEnvironmentTemplate() {
    this.log('Checking environment configuration...', 'info');
    
    const envExample = path.join(this.projectRoot, '.env.example');
    const envLocal = path.join(this.projectRoot, '.env.local');
    
    if (!fs.existsSync(envExample)) {
      this.log('No .env.example file found', 'warning');
    } else {
      this.log('Environment example file exists', 'info');
    }
    
    if (!fs.existsSync(envLocal)) {
      this.log('No .env.local file found - may be intentional', 'info');
    }
  }

  checkAnalyticsConfiguration() {
    this.log('Checking analytics configuration...', 'info');
    
    // Check if analytics components exist and are properly configured
    const analyticsFiles = [
      'src/components/ClientAnalytics.tsx',
      'src/components/SEOAnalytics.tsx'
    ];
    
    analyticsFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('gtag') || content.includes('GA_MEASUREMENT_ID')) {
          this.log(`Analytics configured in: ${file}`, 'info');
        } else {
          this.log(`Analytics may not be configured in: ${file}`, 'warning');
        }
      }
    });
  }

  generateReport() {
    this.log('\n=== PROJECT HEALTH CHECK REPORT ===', 'info');
    this.log(`Project Root: ${this.projectRoot}`, 'info');
    this.log(`Timestamp: ${new Date().toISOString()}`, 'info');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.log('\n✅ PROJECT HEALTH: EXCELLENT', 'info');
      this.log('All checks passed. Project is ready for development.', 'info');
    } else {
      if (this.errors.length > 0) {
        this.log(`\n❌ ERRORS FOUND: ${this.errors.length}`, 'error');
        this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
      }
      
      if (this.warnings.length > 0) {
        this.log(`\n⚠️  WARNINGS: ${this.warnings.length}`, 'warning');
        this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
      }
      
      this.log('\n📋 RECOMMENDED ACTIONS:', 'info');
      this.log('1. Address all errors before proceeding with development', 'info');
      this.log('2. Review warnings and update as needed', 'info');
      this.log('3. Update CLAUDE_PROJECT_STATUS.md with any changes', 'info');
    }

    // Write report to file
    const reportPath = path.join(this.projectRoot, 'project-health-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      errors: this.errors,
      warnings: this.warnings,
      status: this.errors.length === 0 ? 'healthy' : 'needs_attention'
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'info');
  }

  run() {
    this.log('Starting Forward Horizon Marketing project health check...', 'info');
    
    this.checkRequiredFiles();
    this.checkPhoneNumbers();
    this.checkStatusDocumentAge();
    this.checkPackageJsonIntegrity();
    this.checkEnvironmentTemplate();
    this.checkAnalyticsConfiguration();
    
    this.generateReport();
    
    // Exit with error code if critical issues found
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Run the health check
if (require.main === module) {
  const checker = new ProjectHealthChecker();
  checker.run();
}

module.exports = ProjectHealthChecker;