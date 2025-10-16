# SIGL (Structured Image Generation Language) Documentation

**Version:** 0.1.0 (Alpha)  
**Implementation Status:** 🚧 15-20% Complete

Welcome to the comprehensive documentation for SIGL, a powerful domain-specific language designed for creating detailed, customizable scene illustrations with human figures, objects, and environments.

## 📊 Implementation Status Legend

- ✅ **Fully Implemented** - Feature is complete and tested
- 🚧 **Partially Implemented** - Core functionality exists, needs enhancement
- 📋 **Planned** - Specified but not yet implemented
- 💡 **Future Enhancement** - Planned for later versions

## Overview

SIGL provides an intuitive, English-like syntax for describing complex scenes while offering advanced features for customization, reusability, and domain-specific extensions. The language is built on a modular architecture that separates core functionality from specialized domain knowledge.

## 🚀 Quick Links

- **[Getting Started Guide](GETTING_STARTED.md)** ✅ - Start here for your first scene
- **[Implementation Status](../IMPLEMENTATION_STATUS.md)** 🎯 - What's implemented vs planned (~45% complete)
- **[Grammar Specification](system/grammar-specification.md)** ✅ - Formal language definition
- **[Documentation Review](DOCUMENTATION_REVIEW.md)** ✅ - Known gaps and improvements

## Quick Start

```sigl
// Basic scene creation
DRAW MAN WITH AGE 30 AND BLUE SHIRT
DRAW WOMAN WITH RED DRESS NEXT TO MAN
ADD ENVIRONMENT PARK
DRAW TREE BEHIND PEOPLE
```

## Documentation Structure

### 📚 Core System Documentation

The core system provides fundamental entities, attributes, and composition features:

- **[Entities](core/entities.md)** 🚧 - Basic entity types (humans, animals, objects, nature)
- **[Human Attributes](core/human-attributes.md)** 🚧 - Comprehensive human customization options
- **[Positioning and Layout](core/positioning.md)** 📋 - Spatial arrangement and scene composition  
- **[Composition](core/composition.md)** 📋 - Advanced scene building and organization
- **[Colors](core/colors.md)** 🚧 - Color system and specifications

### 🏥 Domain Extensions

Specialized extensions for specific domains and use cases:

- **[Educational](extensions/educational.md)** 📋 - Schools, teachers, students, educational environments
- **[Hospital](extensions/hospital.md)** 📋 - Medical professionals, equipment, medical scenarios
- **[Military](extensions/military.md)** 📋 - Soldiers, officers, military vehicles and equipment
- **[Court and Legal](extensions/court-legal.md)** 📋 - Legal professionals, courtrooms, legal proceedings
- **[Religious](extensions/religious.md)** 📋 - Religious figures, buildings, ceremonies
- **[Transportation](extensions/transportation.md)** 📋 - Vehicles, transportation personnel, travel scenarios
- **[Space](extensions/space.md)** 💡 - Astronauts, spacecraft, space environments

### ⚙️ System Features

Advanced features for power users and developers:

- **[Entity System](system/entity-system.md)** ✅ - Extensible 3D entity builder library (39+ entity types)
- **[Templates and Reusability](features/templates.md)** 🚧 - Template system for reusable components
- **[Background and Environment](features/backgrounds.md)** 📋 - Environmental context and scene settings
- **[Variation Handling](features/variations.md)** 📋 - Advanced parameter and variation system
- **[Animations](features/animations.md)** 📋 - Movement, transitions, and dynamic effects
- **[Patterns](features/patterns.md)** 📋 - Visual patterns for clothing and surfaces
- **[Lighting](features/lighting.md)** 📋 - Advanced lighting and shadows
- **[Rendering](features/rendering.md)** 🚧 - Output formats and quality settings
- **[Advanced Features](features/advanced.md)** 📋 - Implementation guidelines and best practices

## Key Features

### 🎯 Intuitive Syntax
- English-like commands that are easy to read and write
- Logical attribute grouping and smart defaults
- Context-aware suggestions and error handling

### 🧩 Modular Architecture
- Core system with domain-specific extensions
- Load only the functionality you need
- Easy to extend with custom domains

### 🎨 Rich Customization
- Comprehensive attribute system for detailed control
- Template system for reusable components
- Variation handling for parametric customization

### 🌍 Context Awareness
- Environment-based defaults and suggestions
- Cultural and contextual appropriateness validation
- Smart inference from incomplete specifications

### 🔧 Developer Friendly
- Clear error messages and suggestions
- Extensible architecture for custom domains
- Performance optimization guidelines

## Common Use Cases

### Educational Content
```sigl
LOAD EXTENSION educational
ADD ENVIRONMENT CLASSROOM
DRAW TEACHER WITH PROFESSIONAL ATTIRE
DRAW STUDENTS WITH SCHOOL UNIFORMS SITTING AT DESKS
DRAW BLACKBOARD WITH LESSON CONTENT
```

### Medical Scenarios
```sigl
LOAD EXTENSION hospital
ADD ENVIRONMENT OPERATING_ROOM
DRAW SURGEON WITH SURGICAL_SCRUBS AND MASK
DRAW NURSE WITH STERILE_EQUIPMENT
DRAW PATIENT ON OPERATING_TABLE
```

### Legal Proceedings
```sigl
LOAD EXTENSION court
ADD ENVIRONMENT COURTROOM
DRAW JUDGE WITH JUDICIAL_ROBES AT BENCH
DRAW LAWYER WITH FORMAL_SUIT PRESENTING CASE
DRAW JURY IN JURY_BOX
```

### Transportation Scenes
```sigl
LOAD EXTENSION transportation
ADD ENVIRONMENT AIRPORT
DRAW PILOT WITH AIRLINE_UNIFORM
DRAW PASSENGERS WITH TRAVEL_LUGGAGE
DRAW AIRPLANE IN BACKGROUND
```

## Getting Started

### Basic Scene Creation

1. **Start with entities**: Begin by drawing basic people and objects
2. **Add attributes**: Customize appearance, age, clothing, and expressions
3. **Set environment**: Add context with environment presets
4. **Position elements**: Arrange entities using spatial relationships
5. **Refine details**: Use templates and variations for fine-tuning

### Example Workflow

```sigl
// Step 1: Create basic entities
DRAW MAN WITH AGE 35
DRAW WOMAN WITH AGE 30

// Step 2: Add specific attributes
UPDATE MAN WITH BUSINESS_SUIT AND BRIEFCASE
UPDATE WOMAN WITH PROFESSIONAL_DRESS AND LAPTOP

// Step 3: Set environment context
ADD ENVIRONMENT OFFICE

// Step 4: Position elements
PLACE MAN AT DESK
PLACE WOMAN NEXT TO MAN

// Step 5: Add environmental details
DRAW OFFICE_FURNITURE
DRAW WINDOWS WITH CITY_VIEW
```

## Extension System

### Loading Extensions

Extensions are loaded automatically when domain-specific entities are used, or can be loaded explicitly:

```sigl
// Automatic loading
DRAW DOCTOR  // Automatically loads hospital extension

// Explicit loading
LOAD EXTENSION hospital
LOAD EXTENSION transportation
LOAD EXTENSION religious
```

### Available Extensions

| Extension | Description | Key Entities |
|-----------|-------------|--------------|
| **Hospital** | Medical professionals and environments | Doctor, Nurse, Patient, Medical Equipment |
| **Court/Legal** | Legal system and proceedings | Judge, Lawyer, Courtroom, Legal Documents |
| **Religious** | Religious figures and buildings | Priest, Mosque, Temple, Religious Ceremonies |
| **Transportation** | Vehicles and travel scenarios | Pilot, Train, Airport, Vehicle Interiors |
| **Educational** | Schools and learning environments | Teacher, Student, Classroom, School Equipment |

## Best Practices

### For Beginners

1. **Start simple**: Begin with basic entities and gradually add complexity
2. **Use defaults**: Let the system apply appropriate defaults for incomplete specifications
3. **Leverage context**: Set environments to get contextually appropriate defaults
4. **Explore templates**: Use predefined templates for common scenarios

### For Advanced Users

1. **Create templates**: Build reusable components for complex scenes
2. **Use variations**: Leverage the parameter system for fine-grained control
3. **Combine extensions**: Mix domain extensions for complex scenarios
4. **Optimize performance**: Use caching and batching for large scenes

### For Developers

1. **Follow conventions**: Adhere to naming and syntax conventions
2. **Provide defaults**: Always include fallback values for attributes
3. **Validate context**: Check appropriateness of attributes in different contexts
4. **Document extensions**: Provide clear documentation for custom extensions

## Error Handling

SIGL provides comprehensive error handling with helpful suggestions:

```sigl
// Typo correction
DRAW MAN WITH BLU SHIRT
// → "Did you mean 'BLUE SHIRT'?"

// Context validation
ADD ENVIRONMENT OFFICE
DRAW MAN WITH SWIMWEAR
// → "Swimwear inappropriate for office environment. Consider business attire."

// Missing attributes
DRAW MAN WITH BLUE SHIRT
// → "Pants not specified, using default black pants"
```

## Performance Considerations

- **Entity limits**: Recommended maximum of 100 detailed entities per scene
- **Extension loading**: Load only necessary extensions to minimize memory usage
- **Template caching**: Frequently used templates are cached for better performance
- **Batch operations**: Group similar operations for optimal rendering

## Contributing

### Documentation Improvements

- Report unclear or missing documentation
- Suggest additional examples and use cases
- Contribute domain-specific templates and scenarios

### Extension Development

- Follow the extension development framework
- Ensure compatibility with existing extensions
- Provide comprehensive testing and documentation

### Core System Enhancements

- Propose new core features and improvements
- Submit performance optimizations
- Enhance error handling and user experience

## Support and Resources

### Documentation Navigation

- Use the sidebar navigation to explore specific topics
- Cross-references link related concepts across documents
- Examples are provided throughout for practical guidance

### Common Issues

- Check the error handling section for troubleshooting guidance
- Review best practices for optimal usage patterns
- Consult extension documentation for domain-specific issues

### Community

- Share templates and scenarios with the community
- Contribute to extension libraries
- Provide feedback on language features and improvements

---

## Quick Reference

### Basic Syntax
```sigl
DRAW <entity> [WITH <attributes>] [AT <position>]
CREATE <template> "<name>" WITH <definition>
ADD ENVIRONMENT <environment_type>
LOAD EXTENSION <extension_name>
```

### Common Attributes
```sigl
AGE <number>
HAIR <color> | <style>
CLOTHING <type> | OUTFIT <category>
EXPRESSION <emotion>
POSITION <x>,<y> | <relative_position>
```

### Environment Types
```sigl
OFFICE | PARK | HOSPITAL | SCHOOL | BEACH | FOREST | CITY
INDOOR | OUTDOOR | CLASSROOM | COURTROOM | AIRPORT
```

### Extension Commands
```sigl
LOAD EXTENSION hospital | court | religious | transportation | educational
```

This documentation is designed to grow with the SIGL language. As new features and extensions are added, the documentation will be updated to reflect the latest capabilities and best practices.