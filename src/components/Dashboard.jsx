import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ stats, onResetTree, onExportTree, onImportTree }) => {
  const [showExportData, setShowExportData] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);

  const handleExport = () => {
    const data = onExportTree();
    const dataStr = JSON.stringify(data, null, 2);
    
    // Create downloadable file
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family-tree-${new Date().getTime()}.json`;
    link.click();
    
    // Show export data
    setShowExportData(dataStr);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      const result = onImportTree(data);
      
      if (result.success) {
        setImportData('');
        setShowImportForm(false);
        alert('Family tree imported successfully!');
      } else {
        alert('Error importing tree: ' + result.error);
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Invalid JSON format. Please check your data.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the entire family tree? This action cannot be undone.')) {
      onResetTree();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Family tree statistics and management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.totalPointsDistributed}</h3>
            <p>Points Distributed</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>{stats.totalPointsWasted}</h3>
            <p>Points Wasted</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.averagePointsPerMember}</h3>
            <p>Avg Points/Member</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">🏗️</div>
          <div className="stat-content">
            <h3>{stats.maxDepth}</h3>
            <p>Tree Depth</p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🌳</div>
          <div className="stat-content">
            <h3>{stats.rootMembers}</h3>
            <p>Root Families</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-group">
          <h3>Data Management</h3>
          <div className="action-buttons">
            <button onClick={handleExport} className="btn-action export">
              📥 Export Tree
            </button>
            
            <button 
              onClick={() => setShowImportForm(!showImportForm)} 
              className="btn-action import"
            >
              📤 Import Tree
            </button>
            
            <button onClick={handleReset} className="btn-action reset">
              🔄 Reset Tree
            </button>
          </div>
        </div>

        {showImportForm && (
          <div className="import-form">
            <h4>Import Family Tree Data</h4>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your family tree JSON data here..."
              className="import-textarea"
              rows={6}
            />
            <div className="import-actions">
              <button onClick={handleImport} className="btn-primary">
                Import Data
              </button>
              <button 
                onClick={() => {
                  setShowImportForm(false);
                  setImportData('');
                }} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showExportData && (
          <div className="export-data">
            <h4>Exported Data</h4>
            <p>Data has been downloaded. You can also copy it from below:</p>
            <textarea
              value={showExportData}
              readOnly
              className="export-textarea"
              rows={8}
            />
            <button 
              onClick={() => setShowExportData(false)} 
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {stats.totalMembers > 0 && (
        <div className="insights">
          <h3>💡 Insights</h3>
          <div className="insight-cards">
            <div className="insight-card">
              <h4>Points Efficiency</h4>
              <p>
                {stats.totalPointsWasted === 0 
                  ? "Perfect! No points were wasted." 
                  : `${stats.totalPointsWasted} points were wasted due to missing ancestors.`
                }
              </p>
            </div>
            
            <div className="insight-card">
              <h4>Tree Structure</h4>
              <p>
                Your family tree has {stats.maxDepth + 1} generation{stats.maxDepth !== 0 ? 's' : ''} 
                {stats.rootMembers > 1 && ` across ${stats.rootMembers} family lines`}.
              </p>
            </div>
            
            {stats.averagePointsPerMember > 0 && (
              <div className="insight-card">
                <h4>Point Distribution</h4>
                <p>
                  On average, each family member has earned {stats.averagePointsPerMember} points 
                  from their descendants.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="how-points-work">
        <h3>🔍 How Points Work</h3>
        <div className="points-explanation">
          <div className="points-rule">
            <span className="rule-number">1</span>
            <div>
              <strong>Point Distribution:</strong> When you add a new family member, 
              100 points are distributed to their ancestors.
            </div>
          </div>
          
          <div className="points-rule">
            <span className="rule-number">2</span>
            <div>
              <strong>Ancestor Levels:</strong> Points flow up to 10 levels of ancestors 
              (parent, grandparent, great-grandparent, etc.).
            </div>
          </div>
          
          <div className="points-rule">
            <span className="rule-number">3</span>
            <div>
              <strong>Wasted Points:</strong> If an ancestor level is missing, 
              those points are wasted and not redistributed.
            </div>
          </div>
          
          <div className="points-rule">
            <span className="rule-number">4</span>
            <div>
              <strong>Accumulation:</strong> Each person's total points come from 
              all their descendants being added to the tree.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;