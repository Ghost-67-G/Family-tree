import { POINTS_CONFIG } from '../types/index.js';

/**
 * Distributes points to ancestors when a new child is added
 * @param {Array} tree - The family tree array
 * @param {string} childId - ID of the newly added child
 * @returns {Object} - Updated tree and stats about point distribution
 */
export const distributePoints = (tree, childId) => {
  const updatedTree = [...tree];
  let pointsDistributed = 0;
  let pointsWasted = 0;
  
  // Find the child in the tree
  const childIndex = updatedTree.findIndex(person => person.id === childId);
  if (childIndex === -1) return { updatedTree, pointsDistributed, pointsWasted };
  
  let currentPersonId = updatedTree[childIndex].parentId;
  let level = 1;
  
  // Traverse up the tree for up to 10 levels
  while (currentPersonId && level <= POINTS_CONFIG.MAX_ANCESTOR_LEVELS) {
    const personIndex = updatedTree.findIndex(person => person.id === currentPersonId);
    
    if (personIndex !== -1) {
      // Person exists, give them points
      updatedTree[personIndex].points += POINTS_CONFIG.DEFAULT_POINTS;
      pointsDistributed += POINTS_CONFIG.DEFAULT_POINTS;
      currentPersonId = updatedTree[personIndex].parentId;
    } else {
      // Person doesn't exist, points are wasted
      pointsWasted += POINTS_CONFIG.DEFAULT_POINTS;
      break;
    }
    
    level++;
  }
  
  // If we hit the max level limit, any remaining levels would waste points
  if (level <= POINTS_CONFIG.MAX_ANCESTOR_LEVELS && currentPersonId) {
    const remainingLevels = POINTS_CONFIG.MAX_ANCESTOR_LEVELS - level + 1;
    // Count how many more valid ancestors exist beyond the limit
    let tempPersonId = currentPersonId;
    let wastedLevels = 0;
    
    while (tempPersonId && wastedLevels < remainingLevels) {
      const personExists = updatedTree.find(person => person.id === tempPersonId);
      if (personExists) {
        wastedLevels++;
        tempPersonId = personExists.parentId;
      } else {
        break;
      }
    }
  }
  
  return { updatedTree, pointsDistributed, pointsWasted };
};

/** Removes distributed points from ancestors when a person is removed
 * @param {Array} tree - The family tree array
 * @param {string} childId - ID of the child being removed
 * @returns {Object} - Updated tree and stats about point removal
 */

export const removeDistributedPoints = (tree, childId) => {
  const updatedTree = [...tree];
  let pointsRemoved = 0;
  
  // Find the child in the tree
  const childIndex = updatedTree.findIndex(person => person.id === childId);
  if (childIndex === -1) return { updatedTree, pointsRemoved };
  
  const child = updatedTree[childIndex];
  let currentPersonId = child.parentId;
  let level = 1;
  
  // Check if child has points greater than 0
  if (child.points > 0) {
    // Distribute child's points to ancestors (up to 10 levels)
    const pointsToDistribute = child.points;
    const pointsPerLevel = pointsToDistribute;
    
    // Reset child's points to 0
    updatedTree[childIndex].points = 0;
    
    while (currentPersonId && level <= POINTS_CONFIG.MAX_ANCESTOR_LEVELS) {
      const personIndex = updatedTree.findIndex(person => person.id === currentPersonId);
      
      if (personIndex !== -1) {
        // Give points to ancestor
        let pointsToGive = pointsPerLevel;
        updatedTree[personIndex].points += pointsToGive;
        currentPersonId = updatedTree[personIndex].parentId;
      } else {
        break;
      }
      
      level++;
    }
    
    pointsRemoved = pointsToDistribute;
  } else {
    // Child has 0 points, remove 100 points from all ancestors
    while (currentPersonId && level <= POINTS_CONFIG.MAX_ANCESTOR_LEVELS) {
      const personIndex = updatedTree.findIndex(person => person.id === currentPersonId);
      
      if (personIndex !== -1) {
        // Remove points but not below zero
        const pointsToRemove = Math.min(POINTS_CONFIG.DEFAULT_POINTS, updatedTree[personIndex].points);
        updatedTree[personIndex].points -= pointsToRemove;
        pointsRemoved += pointsToRemove;
        currentPersonId = updatedTree[personIndex].parentId;
      } else {
        break;
      }
      
      level++;
    }
  }
  
  return { updatedTree, pointsRemoved };
}

/**
 * Calculates the level/depth of each person in the tree
 * @param {Array} tree - The family tree array
 * @returns {Array} - Tree with updated level information
 */
export const calculateLevels = (tree) => {
  const updatedTree = tree.map(person => ({ ...person, level: 0 }));
  
  // Find root nodes (no parent)
  const rootNodes = updatedTree.filter(person => !person.parentId);
  
  // BFS to calculate levels
  const queue = rootNodes.map(node => ({ ...node, level: 0 }));
  const visited = new Set();
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    
    // Update level in the tree
    const personIndex = updatedTree.findIndex(p => p.id === current.id);
    if (personIndex !== -1) {
      updatedTree[personIndex].level = current.level;
    }
    
    // Add children to queue with incremented level
    const children = updatedTree.filter(person => person.parentId === current.id);
    children.forEach(child => {
      if (!visited.has(child.id)) {
        queue.push({ ...child, level: current.level + 1 });
      }
    });
  }
  
  return updatedTree;
};

/**
 * Updates children arrays for all persons in the tree
 * @param {Array} tree - The family tree array
 * @returns {Array} - Tree with updated children arrays
 */
export const updateChildrenArrays = (tree) => {
  const updatedTree = tree.map(person => ({ ...person, children: [] }));
  
  // Populate children arrays
  updatedTree.forEach(person => {
    if (person.parentId) {
      const parentIndex = updatedTree.findIndex(p => p.id === person.parentId);
      if (parentIndex !== -1) {
        updatedTree[parentIndex].children.push(person.id);
      }
    }
  });
  
  return updatedTree;
};
