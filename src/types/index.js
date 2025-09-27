// Core data structures and constants for the Family Tree application

// Person object structure:
// {
//   id: string,
//   name: string,
//   parentId: string | null,
//   points: number,
//   level: number,
//   children: string[],
//   createdAt: Date
// }

// FamilyTreeStats object structure:
// {
//   totalMembers: number,
//   totalPointsDistributed: number,
//   totalPointsWasted: number,
//   averagePointsPerMember: number,
//   maxDepth: number,
//   rootMembers: number
// }

// TreeAction object structure:
// {
//   type: 'ADD_PERSON' | 'UPDATE_PERSON' | 'DELETE_PERSON' | 'RESET_TREE',
//   payload: any
// }

export const POINTS_CONFIG = {
  DEFAULT_POINTS: 100,
  MAX_ANCESTOR_LEVELS: 10,
};

// Helper function to create a new person
export const createPerson = (id, name, parentId = null) => ({
  id,
  name,
  parentId,
  points: 0,
  level: 0,
  children: [],
  createdAt: new Date(),
});
