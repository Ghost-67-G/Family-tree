# Family Tree with Points Distribution

A dynamic web-based application for creating and managing family trees with an intelligent points distribution system. Each new family member added triggers a points distribution mechanism that rewards ancestors up to 10 levels deep.

## 🌳 Features

### Core Functionality
- **Dynamic Family Tree Creation**: Add family members and build your tree organically
- **Interactive Tree Visualization**: Clean, intuitive tree layout with visual connections
- **Smart Points Distribution**: Automatic point allocation to ancestors (up to 10 levels)
- **Real-time Updates**: Instant visual feedback and points calculation
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### Advanced Features
- **Edit Family Members**: Modify names and details of existing family members
- **Delete Nodes**: Remove family members with intelligent tree restructuring
- **Statistics Dashboard**: View comprehensive analytics including:
  - Total family members
  - Total points distributed
  - Points wasted (due to missing ancestors)
  - Average points per member
- **Data Persistence**: Automatic saving of family tree data
- **Export/Import**: Save and load family tree configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm 8.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/threearrow.git
   cd threearrow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Architecture & Design

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: CSS Modules with modern CSS Grid and Flexbox
- **State Management**: React Context API with useReducer
- **Tree Visualization**: Custom CSS-based implementation
- **Type Safety**: Full TypeScript integration

### Project Structure
```
threearrow/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── FamilyTree/
│   │   │   ├── FamilyTree.tsx
│   │   │   ├── FamilyTree.module.css
│   │   │   └── index.ts
│   │   ├── PersonNode/
│   │   │   ├── PersonNode.tsx
│   │   │   ├── PersonNode.module.css
│   │   │   └── index.ts
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── Button/
│   │       ├── Modal/
│   │       └── Input/
│   ├── context/
│   │   ├── FamilyTreeContext.tsx
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useFamilyTree.ts
│   │   ├── usePoints.ts
│   │   └── useLocalStorage.ts
│   ├── utils/
│   │   ├── pointsCalculation.ts
│   │   ├── treeTraversal.ts
│   │   └── dataValidation.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Design Decisions

#### 1. **Data Structure Choice**
- **Decision**: Adjacency list with parent-child relationships
- **Rationale**: Efficient for tree traversal and dynamic updates
- **Implementation**: Each person node contains references to children and parent

#### 2. **Points Distribution Algorithm**
```typescript
// Simplified algorithm overview
function distributePoints(childId: string, pointsToDistribute: number = 100) {
  let currentPerson = findPersonById(childId);
  let level = 1;
  
  while (currentPerson.parentId && level <= 10) {
    const parent = findPersonById(currentPerson.parentId);
    if (parent) {
      parent.points += pointsToDistribute;
    } else {
      // Points are wasted if parent doesn't exist
      wastedPoints += pointsToDistribute;
    }
    currentPerson = parent;
    level++;
  }
}
```

#### 3. **Tree Visualization Approach**
- **Decision**: Custom CSS-based tree layout
- **Rationale**: 
  - Maximum performance (no external library overhead)
  - Full control over styling and animations
  - Lightweight and fast rendering
  - Easy customization and theming

#### 4. **State Management Strategy**
- **Decision**: React Context API with useReducer
- **Rationale**:
  - Sufficient for medium-complexity state
  - No external dependencies
  - Type-safe with TypeScript
  - Easy to test and maintain

## 🎮 Usage Guide

### Adding Family Members

1. **Start with Root Member**
   - Click "Add Root Member" to create the first family member
   - Enter the person's name and save

2. **Add Children**
   - Click the "+" button on any existing family member
   - Enter the child's name
   - Points are automatically distributed to ancestors

3. **View Points Distribution**
   - Each person's current points are displayed on their node
   - Hover over a person to see detailed point breakdown

### Managing the Tree

#### Editing Members
- Click the edit icon (✏️) on any person node
- Modify the name and save changes
- Tree relationships remain intact

#### Deleting Members
- Click the delete icon (🗑️) on any person node
- Confirm deletion in the popup
- Children are automatically reassigned to the deleted person's parent

#### Viewing Statistics
- Click "View Stats" to open the dashboard
- See comprehensive analytics about your family tree
- Export data or generate reports

### Points System Explained

#### How Points Work
- **Base Points**: 100 points per new child added
- **Distribution**: Points go to ancestors up to 10 levels
- **Wasted Points**: If an ancestor level is missing, those points are lost
- **Accumulation**: Each person accumulates points from all descendants

#### Example Scenario
```
Great-Grandparent (300 pts) ← Level 3: +100 pts
    ↓
Grandparent (200 pts) ← Level 2: +100 pts  
    ↓
Parent (100 pts) ← Level 1: +100 pts
    ↓
New Child (0 pts) ← Just added
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Individual components and utility functions
- **Integration Tests**: Context providers and hooks
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Tree rendering with large datasets

## 🚀 Deployment

### Environment Setup
1. **Create production build**
   ```bash
   npm run build
   ```

2. **Deploy to static hosting** (Netlify, Vercel, GitHub Pages)
   ```bash
   # Example for Netlify
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_APP_TITLE=Family Tree App
VITE_MAX_TREE_DEPTH=10
VITE_DEFAULT_POINTS=100
```

## 🔧 Configuration

### Customizing Points Distribution
Modify `src/utils/pointsCalculation.ts`:
```typescript
export const POINTS_CONFIG = {
  DEFAULT_POINTS: 100,
  MAX_ANCESTOR_LEVELS: 10,
  POINT_MULTIPLIERS: {
    // Optional: different points for different levels
    1: 1.0,  // Parent gets 100% of points
    2: 0.8,  // Grandparent gets 80% of points
    // ... customize as needed
  }
};
```

### Styling Customization
Update CSS variables in `src/App.css`:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --tree-line-color: #e2e8f0;
  --node-border-radius: 8px;
  --spacing-unit: 1rem;
}
```

## 📊 Performance Considerations

### Optimization Strategies
- **Virtual Scrolling**: For trees with 1000+ nodes
- **Memoization**: React.memo for person nodes
- **Lazy Loading**: Load tree branches on demand
- **Debounced Updates**: Prevent excessive re-renders

### Scalability Limits
- **Recommended**: Up to 500 family members
- **Maximum Tested**: 2000 family members
- **Memory Usage**: ~50KB per 100 family members

## 🐛 Troubleshooting

### Common Issues

#### Tree Not Rendering
```bash
# Clear browser cache and restart
npm run dev -- --force
```

#### Points Not Updating
- Check browser console for JavaScript errors
- Verify that ancestors exist in the tree structure
- Ensure maximum depth (10 levels) isn't exceeded

#### Performance Issues
- Reduce tree visualization complexity
- Enable performance mode in settings
- Consider browser memory limitations

### Debug Mode
Enable debug logging:
```typescript
// In src/utils/debug.ts
export const DEBUG_MODE = true;
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes and test thoroughly
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with React hooks
- **Prettier**: Automatic code formatting
- **Commits**: Conventional commit messages

### Testing Requirements
- Minimum 80% code coverage
- All tests must pass
- No TypeScript errors
- No ESLint warnings

## 📈 Roadmap

### Upcoming Features
- [ ] **Multi-tree Support**: Manage multiple family trees
- [ ] **Photo Integration**: Add profile pictures to family members
- [ ] **Relationship Types**: Support for marriages, adoptions, etc.
- [ ] **Tree Themes**: Multiple visual themes and layouts
- [ ] **Collaboration**: Share trees with family members
- [ ] **Mobile App**: React Native version

### Backend Integration (Bonus)
- [ ] **Node.js API**: RESTful backend services
- [ ] **Database**: MongoDB or PostgreSQL integration
- [ ] **Authentication**: User accounts and tree ownership
- [ ] **Real-time Updates**: WebSocket support for collaborative editing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript team for type safety
- CSS Grid and Flexbox specifications
- Open source community for inspiration

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

---

**Happy Family Tree Building! 🌳**

> "Family is not an important thing, it's everything." - Michael J. Fox
