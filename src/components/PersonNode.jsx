import React, { useState } from 'react';
import './PersonNode.css';

const PersonNode = ({ 
  person, 
  children = [], 
  onAddChild, 
  onUpdate, 
  onRemove, 
  level = 0 
}) => {
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [childName, setChildName] = useState('');
  const [editName, setEditName] = useState(person.name);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddChild = async () => {
    if (childName.trim()) {
      const result = await onAddChild(childName.trim(), person.id);
      if (result.success) {
        setChildName('');
        setIsAddingChild(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (editName.trim() && editName.trim() !== person.name) {
      const result = await onUpdate(person.id, { name: editName.trim() });
      if (result.success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
      await onRemove(person.id);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      if (action === handleAddChild) {
        setIsAddingChild(false);
        setChildName('');
      } else if (action === handleUpdate) {
        setIsEditing(false);
        setEditName(person.name);
      }
    }
  };

  return (
    <div className={`person-node level-${level}`}>
      <div className="person-card">
        <div className="person-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleUpdate)}
                className="edit-input"
                autoFocus
              />
              <div className="edit-actions">
                <button onClick={handleUpdate} className="btn-save">✓</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setEditName(person.name);
                }} className="btn-cancel">✗</button>
              </div>
            </div>
          ) : (
            <div className="person-display">
              <h3 className="person-name">{person.name}</h3>
              <div className="person-meta">
                <span className="person-points">{person.points} pts</span>
                <span className="person-level">Level {person.level}</span>
              </div>
            </div>
          )}
        </div>

        <div className="person-actions">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-details"
            title="Show details"
          >
            ℹ️
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="btn-edit"
            title="Edit name"
          >
            ✏️
          </button>
          
          <button
            onClick={() => setIsAddingChild(true)}
            className="btn-add"
            title="Add child"
          >
            ➕
          </button>
          
          <button
            onClick={handleRemove}
            className="btn-remove"
            title="Remove person"
          >
            🗑️
          </button>
        </div>

        {showDetails && (
          <div className="person-details">
            <p><strong>ID:</strong> {person.id}</p>
            <p><strong>Children:</strong> {children.length}</p>
            <p><strong>Created:</strong> {new Date(person.createdAt).toLocaleDateString()}</p>
            {person.parentId && <p><strong>Parent ID:</strong> {person.parentId}</p>}
          </div>
        )}

        {isAddingChild && (
          <div className="add-child-form">
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleAddChild)}
              placeholder="Enter child's name"
              className="child-name-input"
              autoFocus
            />
            <div className="add-child-actions">
              <button onClick={handleAddChild} className="btn-save">Add</button>
              <button onClick={() => {
                setIsAddingChild(false);
                setChildName('');
              }} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="children-container">
          <div className="connection-line"></div>
          <div className="children-grid">
            {children.map(child => (
              <PersonNode
                key={child.id}
                person={child}
                children={child.children}
                onAddChild={onAddChild}
                onUpdate={onUpdate}
                onRemove={onRemove}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonNode;
