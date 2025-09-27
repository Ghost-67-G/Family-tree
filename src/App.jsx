import './App.css'
import FamilyTree from './components/FamilyTree'
import Dashboard from './components/Dashboard.jsx'
import { useFamilyTree } from './hooks/useFamilyTree.js'

function App() {
  // Initialize with some example data for testing
  const initialTree = [
    {
      id: '1',
      name: 'Alice (Root)',
      parentId: null,
      points: 300,
      level: 0,
      children: ['2', '3'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Bob',
      parentId: '1',
      points: 200,
      level: 1,
      children: ['4', '5'],
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      name: 'Charlie',
      parentId: '1',
      points: 100,
      level: 1,
      children: ['6'],
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      name: 'David',
      parentId: '2',
      points: 0,
      level: 2,
      children: [],
      createdAt: new Date('2024-01-04')
    },
    {
      id: '5',
      name: 'Eve',
      parentId: '2',
      points: 0,
      level: 2,
      children: [],
      createdAt: new Date('2024-01-05')
    },
    {
      id: '6',
      name: 'Frank',
      parentId: '3',
      points: 0,
      level: 2,
      children: [],
      createdAt: new Date('2024-01-06')
    }
  ];

  const familyTreeManager = useFamilyTree(initialTree);

  const {
    tree,
    stats,
    loading,
    error,
    addPerson,
    updatePerson,
    removePerson,
    resetTree,
    getRootMembers,
    getChildren,
  } = familyTreeManager;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌳 Family Tree with Points Distribution</h1>
        <p>Build your family tree and watch points flow to ancestors!</p>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="app-content">
        <FamilyTree 
          tree={tree}
          loading={loading}
          onAddPerson={addPerson}
          onUpdatePerson={updatePerson}
          onRemovePerson={removePerson}
          getRootMembers={getRootMembers}
          getChildren={getChildren}
        />
        
        <Dashboard 
          stats={stats}
          onResetTree={resetTree}
          onExportTree={() => familyTreeManager.exportTree()}
          onImportTree={(data) => familyTreeManager.importTree(data)}
        />
      </div>
    </div>
  )
}

export default App
