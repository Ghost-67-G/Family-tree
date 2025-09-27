import { useState, useCallback, useEffect } from 'react';
import { addPerson, updatePerson, removePerson, validateTree } from '../utils/treeOperations.js';
import { calculateStats } from '../utils/stats.js';

/**
 * Custom hook for managing family tree state and operations
 * @param {Array} initialTree - Initial tree data
 * @returns {Object} - Tree state and management functions
 */
export const useFamilyTree = (initialTree = []) => {
  const [tree, setTree] = useState(initialTree);
  const [stats, setStats] = useState(calculateStats(initialTree));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPointsWasted, setTotalPointsWasted] = useState(0);

  // Update stats whenever tree changes
  useEffect(() => {
    const newStats = calculateStats(tree);
    setStats({
      ...newStats,
      totalPointsWasted,
    });
  }, [tree, totalPointsWasted]);

  /**
   * Adds a new person to the tree
   */
  const handleAddPerson = useCallback(async (name, parentId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = addPerson(tree, name, parentId);
      setTree(result.tree);
      setTotalPointsWasted(prev => prev + result.pointsWasted);
      
      return {
        success: true,
        person: result.addedPerson,
        pointsDistributed: result.pointsDistributed,
        pointsWasted: result.pointsWasted,
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, [tree]);

  /**
   * Updates an existing person
   */
  const handleUpdatePerson = useCallback(async (personId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTree = updatePerson(tree, personId, updates);
      setTree(updatedTree);
      
      return {
        success: true,
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, [tree]);

  /**
   * Removes a person from the tree
   */
  const handleRemovePerson = useCallback(async (personId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = removePerson(tree, personId);
      setTree(result.tree);
      
      return {
        success: true,
        removedPerson: result.removedPerson,
        reassignedChildren: result.reassignedChildren,
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, [tree]);

  /**
   * Resets the entire tree
   */
  const handleResetTree = useCallback(() => {
    setTree([]);
    setTotalPointsWasted(0);
    setError(null);
  }, []);

  /**
   * Validates the current tree structure
   */
  const validateCurrentTree = useCallback(() => {
    return validateTree(tree);
  }, [tree]);

  /**
   * Gets a person by ID
   */
  const getPersonById = useCallback((personId) => {
    return tree.find(person => person.id === personId) || null;
  }, [tree]);

  /**
   * Gets children of a person
   */
  const getChildren = useCallback((parentId) => {
    return tree.filter(person => person.parentId === parentId);
  }, [tree]);

  /**
   * Gets root members (those with no parent)
   */
  const getRootMembers = useCallback(() => {
    return tree.filter(person => !person.parentId);
  }, [tree]);

  /**
   * Exports tree data
   */
  const exportTree = useCallback(() => {
    return {
      tree,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
  }, [tree, stats]);

  /**
   * Imports tree data
   */
  const importTree = useCallback((data) => {
    try {
      if (data && Array.isArray(data.tree)) {
        setTree(data.tree);
        setTotalPointsWasted(data.stats?.totalPointsWasted || 0);
        setError(null);
        return { success: true };
      } else {
        throw new Error('Invalid tree data format');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  return {
    // State
    tree,
    stats,
    loading,
    error,
    
    // Actions
    addPerson: handleAddPerson,
    updatePerson: handleUpdatePerson,
    removePerson: handleRemovePerson,
    resetTree: handleResetTree,
    
    // Queries
    getPersonById,
    getChildren,
    getRootMembers,
    validateTree: validateCurrentTree,
    
    // Utilities
    exportTree,
    importTree,
  };
};
