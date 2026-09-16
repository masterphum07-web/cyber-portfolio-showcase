const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
const jsDataPath = path.join(__dirname, '..', 'js', 'data.js');

const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const jsContent = `/**
 * PORTFOLIO DATA STORE
 * รวบรวมโปรเจคจริงทั้งหมดจาก Desktop ของผู้ใช้
 */

window.PORTFOLIO_DATA = ${JSON.stringify(rawData, null, 2)};

// Save a deep clone of the initial default data for reset capabilities & restore customizations
if (typeof window !== 'undefined') {
  try {
    window.INITIAL_PORTFOLIO_DATA = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));

    if (typeof localStorage !== 'undefined') {
      const savedProjects = localStorage.getItem('portfolio_projects_data');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) {
          window.PORTFOLIO_DATA.projects = parsed;
        }
      }

      const savedProfile = localStorage.getItem('portfolio_profile_data');
      if (savedProfile) {
        const parsedProf = JSON.parse(savedProfile);
        if (parsedProf && typeof parsedProf === 'object') {
          window.PORTFOLIO_DATA.portfolio_owner = Object.assign({}, window.PORTFOLIO_DATA.portfolio_owner, parsedProf);
        }
      }
    }
  } catch (err) {
    console.warn('[DataStore] Error restoring data from localStorage:', err);
  }
}
`;

fs.writeFileSync(jsDataPath, jsContent, 'utf8');
console.log('Successfully updated js/data.js with all 14 desktop projects and hydration logic!');
