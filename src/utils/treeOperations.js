import { createPerson } from '../types/index.js';
import { distributePoints, calculateLevels, updateChildrenArrays, removeDistributedPoints } from './pointsCalculation.js';

/**
 * Generates a unique ID for new family members
 * @returns {string} - Unique identifier
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Adds a new person to the family tree
 * @param {Array} tree - Current family tree
 * @param {string} name - Name of the new person
 * @param {string|null} parentId - ID of the parent (null for root)
 * @returns {Object} - Updated tree and statistics
 */
export const addPerson = (tree, name, parentId = null) => {
  if (!name.trim()) {
    throw new Error('Name cannot be empty');
  }

  // Check if parent exists (if parentId is provided)
  if (parentId) {
    const parentExists = tree.find(person => person.id === parentId);
    if (!parentExists) {
      throw new Error('Parent not found in the tree');
    }
  }

  const newId = generateId();
  const newPerson = createPerson(newId, name.trim(), parentId);
  
  // Add the new person to the tree
  let updatedTree = [...tree, newPerson];
  
  // Update levels and children arrays
  updatedTree = calculateLevels(updatedTree);
  updatedTree = updateChildrenArrays(updatedTree);
  
  // Distribute points to ancestors if this person has a parent
  let pointsDistributed = 0;
  let pointsWasted = 0;
  
  if (parentId) {
    const result = distributePoints(updatedTree, newId);
    updatedTree = result.updatedTree;
    pointsDistributed = result.pointsDistributed;
    pointsWasted = result.pointsWasted;
  }
  
  return {
    tree: updatedTree,
    addedPerson: newPerson,
    pointsDistributed,
    pointsWasted,
  };
};

/**
 * Updates an existing person in the family tree
 * @param {Array} tree - Current family tree
 * @param {string} personId - ID of the person to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Array} - Updated tree
 */
export const updatePerson = (tree, personId, updates) => {
  const personIndex = tree.findIndex(person => person.id === personId);
  
  if (personIndex === -1) {
    throw new Error('Person not found in the tree');
  }
  
  // Create updated tree
  const updatedTree = [...tree];
  updatedTree[personIndex] = {
    ...updatedTree[personIndex],
    ...updates,
    id: personId, // Ensure ID cannot be changed
  };
  
  // Recalculate levels and children if needed
  return updateChildrenArrays(calculateLevels(updatedTree));
};

/**
 * Removes a person from the family tree
 * @param {Array} tree - Current family tree
 * @param {string} personId - ID of the person to remove
 * @returns {Object} - Updated tree and removal statistics
 */
export const removePerson = (tree, personId) => {
  const personIndex = tree.findIndex(person => person.id === personId);
  
  if (personIndex === -1) {
    throw new Error('Person not found in the tree');
  }
  let updatedTree = [...tree];
  const personToRemove = tree[personIndex];
  const children = tree.filter(person => person.parentId === personId);

  if (personToRemove.id) {
    const result = removeDistributedPoints(updatedTree, personToRemove.id);
      console.log('🚀 ~ treeOperations.js:130 ~ removePerson ~ result:', result);

      updatedTree = result.updatedTree;
    }

  
  // Remove the person from the tree
  updatedTree = tree.filter(person => person.id !== personId);
  
  // Handle children - reassign them to the removed person's parent
  children.forEach(child => {
    const childIndex = updatedTree.findIndex(person => person.id === child.id);
    if (childIndex !== -1) {
      updatedTree[childIndex] = {
        ...updatedTree[childIndex],
        parentId: personToRemove.parentId, // Reassign to grandparent
      };
    }
  });

  
  
  // Recalculate levels and children arrays
  updatedTree = calculateLevels(updatedTree);
  updatedTree = updateChildrenArrays(updatedTree);

  return {
    tree: updatedTree,
    removedPerson: personToRemove,
    reassignedChildren: children.length,
  };
};

/**
 * Finds a person in the tree by ID
 * @param {Array} tree - The family tree
 * @param {string} personId - ID of the person to find
 * @returns {Object|null} - The person object or null if not found
 */
export const findPersonById = (tree, personId) => {
  return tree.find(person => person.id === personId) || null;
};

/**
 * Gets the root members of the tree (those with no parents)
 * @param {Array} tree - The family tree
 * @returns {Array} - Array of root members
 */
export const getRootMembers = (tree) => {
  return tree.filter(person => !person.parentId);
};

/**
 * Validates the tree structure for consistency
 * @param {Array} tree - The family tree
 * @returns {Object} - Validation results
 */
export const validateTree = (tree) => {
  const errors = [];
  const warnings = [];
  
  tree.forEach(person => {
    // Check if parent exists (if parentId is set)
    if (person.parentId) {
      const parentExists = tree.find(p => p.id === person.parentId);
      if (!parentExists) {
        errors.push(`Person ${person.name} (${person.id}) has non-existent parent ${person.parentId}`);
      }
    }
    
    // Check for circular references
    if (person.parentId === person.id) {
      errors.push(`Person ${person.name} (${person.id}) is their own parent`);
    }
    
    // Check for duplicate IDs
    const duplicates = tree.filter(p => p.id === person.id);
    if (duplicates.length > 1) {
      errors.push(`Duplicate ID found: ${person.id}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
