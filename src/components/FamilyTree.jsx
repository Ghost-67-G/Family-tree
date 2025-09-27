import React, { useState } from 'react';
import PersonNode from './PersonNode';
import './FamilyTree.css';

const FamilyTree = ({ 
  tree, 
  loading, 
  onAddPerson, 
  onUpdatePerson, 
  onRemovePerson, 
  getRootMembers, 
  getChildren 
}) => {
  const [newRootName, setNewRootName] = useState('');
  const [isAddingRoot, setIsAddingRoot] = useState(false);

  const rootMembers = getRootMembers();

  const handleAddRoot = async () => {
    if (newRootName.trim()) {
      const result = await onAddPerson(newRootName.trim(), null);
      if (result.success) {
        setNewRootName('');
        setIsAddingRoot(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddRoot();
    } else if (e.key === 'Escape') {
      setIsAddingRoot(false);
      setNewRootName('');
    }
  };

  // Build tree structure with children
  const buildTreeWithChildren = (person) => {
    const children = getChildren(person.id);
    return {
      ...person,
      children: children.map(buildTreeWithChildren)
    };
  };

  const treeWithChildren = rootMembers.map(buildTreeWithChildren);
  console.log('🚀 ~ FamilyTree.jsx:48 ~ FamilyTree ~ treeWithChildren:', treeWithChildren);


  if (loading) {
    return (
      <div className="family-tree-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing family tree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="family-tree-container">
      <div className="family-tree-header">
        <h2>🌳 Family Tree</h2>
        <p className="tree-stats">
          {tree.length} members • {rootMembers.length} families
        </p>
      </div>

      {tree.length === 0 ? (
        <div className="empty-tree">
          <div className="empty-tree-content">
            <h3>Start Your Family Tree</h3>
            <p>Add the first family member to begin building your tree!</p>
            
            {isAddingRoot ? (
              <div className="add-root-form">
                <input
                  type="text"
                  value={newRootName}
                  onChange={(e) => setNewRootName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter name for root member"
                  className="root-name-input"
                  autoFocus
                />
                <div className="add-root-actions">
                  <button onClick={handleAddRoot} className="btn-primary">
                    Create Root Member
                  </button>
                  <button 
                    onClick={() => {
                      setIsAddingRoot(false);
                      setNewRootName('');
                    }} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingRoot(true)} 
                className="btn-primary btn-large"
              >
                ➕ Add Root Member
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="tree-content">
          <div className="tree-controls">
            {isAddingRoot ? (
              <div className="add-root-form inline">
                <input
                  type="text"
                  value={newRootName}
                  onChange={(e) => setNewRootName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter name for new root member"
                  className="root-name-input small"
                />
                <button onClick={handleAddRoot} className="btn-primary small">
                  Add
                </button>
                <button 
                  onClick={() => {
                    setIsAddingRoot(false);
                    setNewRootName('');
                  }} 
                  className="btn-secondary small"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingRoot(true)} 
                className="btn-outline"
                title="Add another root member"
              >
                ➕ Add Root Member
              </button>
            )}
          </div>

          <div className="tree-visualization">
            {treeWithChildren.map(rootPerson => (
              <PersonNode
                key={rootPerson.id}
                person={rootPerson}
                children={rootPerson.children}
                onAddChild={onAddPerson}
                onUpdate={onUpdatePerson}
                onRemove={onRemovePerson}
                level={0}
              />
            ))}
          </div>
        </div>
      )}

      <div className="tree-legend">
        <h4>How it works:</h4>
        <ul>
          <li>🔄 <strong>Add children:</strong> Click ➕ on any person</li>
          <li>📊 <strong>Points:</strong> Each new child gives 100 points to ancestors (up to 10 levels)</li>
          <li>✏️ <strong>Edit:</strong> Click the edit icon to change names</li>
          <li>🗑️ <strong>Remove:</strong> Click delete to remove (children move up one level)</li>
        </ul>
      </div>
    </div>
  );
};

export default FamilyTree;