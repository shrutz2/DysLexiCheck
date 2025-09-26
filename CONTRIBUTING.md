# Contributing to DysLexiCheck

Thank you for your interest in contributing to DysLexiCheck! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Provide system information (OS, Python version, etc.)
- Include error messages and logs if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide use cases and examples
- Discuss implementation approaches if possible

### Code Contributions

#### 1. Fork and Clone
```bash
git clone https://github.com/your-username/DysLexiCheck.git
cd DysLexiCheck
```

#### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

#### 3. Set Up Development Environment
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 4. Make Changes
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

#### 5. Commit Changes
```bash
git add .
git commit -m "Add: Brief description of changes"
```

#### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### Python
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions focused and small
- Use type hints where appropriate

### JavaScript/React
- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names
- Add PropTypes or TypeScript for type checking
- Keep components focused and reusable

### General
- Write clear commit messages
- Comment complex logic
- Remove debugging code before committing
- Test your changes thoroughly

## 🧪 Testing

### Running Tests
```bash
# Python tests
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Adding Tests
- Add unit tests for new functions
- Add integration tests for new features
- Ensure test coverage remains high
- Test edge cases and error conditions

## 📚 Documentation

### Code Documentation
- Add docstrings to all functions and classes
- Include parameter and return type information
- Provide usage examples for complex functions

### README Updates
- Update README.md for new features
- Add new dependencies to installation instructions
- Update usage examples as needed

## 🔍 Code Review Process

1. **Automated Checks**: All PRs must pass automated tests
2. **Manual Review**: Code will be reviewed by maintainers
3. **Feedback**: Address any requested changes
4. **Approval**: PR will be merged after approval

## 🚀 Development Setup

### Prerequisites
- Python 3.7+
- Node.js 14+
- Git
- Code editor (VS Code recommended)

### Recommended Extensions (VS Code)
- Python
- Pylance
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

### Environment Variables
Create a `.env` file for local development:
```
AZURE_SUBSCRIPTION_KEY=your_key_here
AZURE_ENDPOINT=your_endpoint_here
BING_API_KEY=your_bing_key_here
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No sensitive data is included
- [ ] Feature is tested on multiple browsers (if frontend)
- [ ] API changes are backward compatible

## 🐛 Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. Windows 10]
- Python Version: [e.g. 3.8]
- Browser: [e.g. Chrome 91]
```

## 💡 Feature Request Template

```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Any other relevant information.
```

## 📞 Getting Help

- Join our discussions in GitHub Discussions
- Check existing issues and documentation
- Reach out to maintainers for complex questions

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to DysLexiCheck! 🎉