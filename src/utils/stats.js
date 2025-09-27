/**
 * Calculates comprehensive statistics for the family tree
 * @param {Array} tree - The family tree array
 * @returns {Object} - Statistics object with various metrics
 */
const calculateStats = (tree) => {
  if (!tree || tree.length === 0) {
    return {
      totalMembers: 0,
      totalPointsDistributed: 0,
      totalPointsWasted: 0,
      averagePointsPerMember: 0,
      maxDepth: 0,
      rootMembers: 0,
    };
  }

  const totalMembers = tree.length;
  const totalPointsDistributed = tree.reduce((sum, person) => sum + (person.points || 0), 0);
  
  // Calculate root members (those with no parent)
  const rootMembers = tree.filter(person => !person.parentId).length;
  
  // Calculate maximum depth
  const maxDepth = tree.reduce((max, person) => Math.max(max, person.level || 0), 0);
  
  // Calculate average points per member
  const averagePointsPerMember = totalMembers > 0 ? totalPointsDistributed / totalMembers : 0;
  
  // For now, we'll calculate wasted points based on a theoretical maximum
  // This could be enhanced with actual tracking during point distribution
  const totalPointsWasted = 0; // This would be calculated during actual point distribution
  
  return {
    totalMembers,
    totalPointsDistributed,
    totalPointsWasted,
    averagePointsPerMember: Math.round(averagePointsPerMember * 100) / 100,
    maxDepth,
    rootMembers,
  };
};

/**
 * Gets the children of a specific person
 * @param {Array} tree - The family tree array  
 * @param {string} parentId - ID of the parent
 * @returns {Array} - Array of children
 */
const getChildren = (tree, parentId) => {
  return tree.filter(person => person.parentId === parentId);
};

/**
 * Gets all descendants of a specific person
 * @param {Array} tree - The family tree array
 * @param {string} ancestorId - ID of the ancestor
 * @returns {Array} - Array of all descendants
 */
const getDescendants = (tree, ancestorId) => {
  const descendants = [];
  const queue = [ancestorId];
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = getChildren(tree, currentId);
    
    children.forEach(child => {
      descendants.push(child);
      queue.push(child.id);
    });
  }
  
  return descendants;
};

/**
 * Gets all ancestors of a specific person up to a certain level
 * @param {Array} tree - The family tree array
 * @param {string} personId - ID of the person
 * @param {number} maxLevels - Maximum levels to traverse (default 10)
 * @returns {Array} - Array of ancestors
 */
const getAncestors = (tree, personId, maxLevels = 10) => {
  const ancestors = [];
  let currentPerson = tree.find(p => p.id === personId);
  let level = 0;
  
  while (currentPerson && currentPerson.parentId && level < maxLevels) {
    const parent = tree.find(p => p.id === currentPerson.parentId);
    if (parent) {
      ancestors.push(parent);
      currentPerson = parent;
      level++;
    } else {
      break;
    }
  }
  
  return ancestors;
};

export { 
  calculateStats, 
  getChildren, 
  getDescendants, 
  getAncestors 
};