# SIGL Aliasing System

## Overview

The SIGL Aliasing System provides a powerful mechanism for creating shortcuts, references, and reusable entity definitions. This system enables developers to create more maintainable and readable SIGL code by allowing entities to be referenced by custom names, grouped into collections, and reused across different contexts.

## Core Principles

1. **Simplification**: Reduce repetitive entity definitions
2. **Reusability**: Create once, use many times
3. **Maintainability**: Central definition points for easy updates
4. **Readability**: Meaningful names for complex entity configurations
5. **Flexibility**: Support for both simple aliases and complex references

## Basic Alias Syntax

### Simple Entity Aliases

```sigl
# Define an alias
@alias hero = human(age:25, emotion:confident, hair:brown)

# Use the alias
create hero at(0,0)
```

### Attribute Aliases

```sigl
# Define attribute combinations
@alias warrior_gear = clothing:armor, weapon:sword, shield:round
@alias mage_gear = clothing:robe, weapon:staff, accessory:hat

# Use in entity creation
create human(age:30, warrior_gear) at(5,0)
create human(age:40, mage_gear) at(10,0)
```

## Advanced Aliasing

### Parameterized Aliases

```sigl
# Aliases with parameters
@alias guard(weapon_type) = human(
    age:30-40,
    emotion:alert,
    clothing:uniform,
    weapon:${weapon_type},
    stance:ready
)

# Usage
create guard(sword) at(0,0)
create guard(spear) at(5,0)
create guard(bow) at(10,0)
```

### Conditional Aliases

```sigl
# Aliases with conditional logic
@alias villager(profession) = human(
    age:20-60,
    clothing:${profession == "farmer" ? "work_clothes" : "casual"},
    tool:${profession == "farmer" ? "hoe" : profession == "blacksmith" ? "hammer" : "none"}
)

# Usage
create villager(farmer) at(0,0)
create villager(blacksmith) at(5,0)
create villager(merchant) at(10,0)
```

## Alias Collections

### Group Definitions

```sigl
# Define a collection of related aliases
@collection party {
    leader = human(age:30, emotion:confident, clothing:armor, weapon:sword)
    mage = human(age:25, emotion:focused, clothing:robe, weapon:staff)
    archer = human(age:22, emotion:alert, clothing:leather, weapon:bow)
    healer = human(age:28, emotion:calm, clothing:white_robe, tool:healing_kit)
}

# Use collection members
create party.leader at(0,0)
create party.mage at(-2,2)
create party.archer at(2,2)
create party.healer at(0,4)
```

### Nested Collections

```sigl
@collection army {
    @collection infantry {
        soldier = human(age:20-30, clothing:armor, weapon:sword)
        spearman = human(age:20-30, clothing:armor, weapon:spear)
        archer = human(age:18-28, clothing:leather, weapon:bow)
    }
    
    @collection cavalry {
        knight = human(age:25-35, clothing:heavy_armor, weapon:lance) + horse(color:brown)
        scout = human(age:20-30, clothing:light_armor, weapon:sword) + horse(color:black)
    }
}

# Usage
create army.infantry.soldier at(0,0)
create army.cavalry.knight at(10,0)
```

## Reference System

### Entity References

```sigl
# Create entities with references
create human(age:25, name:"Alice") as @alice at(0,0)
create human(age:30, name:"Bob") as @bob at(5,0)

# Reference entities in actions
move @alice to(@bob.position + offset(1,0))
@alice.emotion = happy
@bob.look_at(@alice)
```

### Dynamic References

```sigl
# Reference by properties
@ref nearest_guard = find(human, clothing:uniform, distance:closest)
@ref all_villagers = find(human, clothing:casual, area:village)

# Use references
@nearest_guard.emotion = alert
for entity in @all_villagers {
    entity.emotion = scared
}
```

## Alias Inheritance

### Base Aliases

```sigl
# Base character template
@alias base_character = human(age:25, emotion:neutral)

# Inherit and extend
@alias warrior extends base_character = clothing:armor, weapon:sword
@alias mage extends base_character = clothing:robe, weapon:staff
@alias archer extends base_character = clothing:leather, weapon:bow

# Usage
create warrior at(0,0)  # Inherits age:25, emotion:neutral, adds armor and sword
```

### Override Inheritance

```sigl
@alias experienced_warrior extends warrior = age:35, emotion:confident

# Results in: human(age:35, emotion:confident, clothing:armor, weapon:sword)
```

## Domain-Specific Aliasing

### Environment Aliases

```sigl
@collection environments {
    forest = {
        ground: grass,
        trees: oak(density:high),
        lighting: dappled,
        sounds: birds
    }
    
    dungeon = {
        ground: stone,
        walls: brick,
        lighting: torch,
        sounds: dripping
    }
}

# Apply environment
apply environments.forest to area(0,0,20,20)
```

### Scene Aliases

```sigl
@alias tavern_scene = {
    bartender = human(age:45, clothing:apron) at(bar_position),
    customers = [
        human(age:30, emotion:happy) at(table1),
        human(age:25, emotion:tired) at(table2)
    ],
    atmosphere = {
        lighting: warm,
        sounds: chatter,
        music: lute
    }
}

# Deploy scene
create tavern_scene
```

## Alias Scoping

### Local Aliases

```sigl
scene village_market {
    # Local aliases only available within this scene
    @alias vendor = human(age:40, clothing:merchant, emotion:friendly)
    @alias customer = human(age:20-50, clothing:casual, emotion:curious)
    
    create vendor at(market_stall)
    create customer at(browsing_area)
}
```

### Global Aliases

```sigl
# Global aliases available everywhere
@global alias protagonist = human(age:25, name:"Hero", emotion:determined)
@global alias antagonist = human(age:40, name:"Villain", emotion:evil)
```

## Alias Validation

### Type Checking

```sigl
# Ensure alias produces valid entity
@alias valid_human = human(age:25, emotion:happy)  # ✓ Valid
@alias invalid_human = human(age:"old", emotion:123)  # ✗ Invalid types

# Validation occurs at alias definition time
```

### Constraint Validation

```sigl
# Aliases with constraints
@alias adult_human = human(age:18+, emotion:any)
@alias child_human = human(age:0-17, emotion:any)

# Usage validation
create adult_human(age:25)  # ✓ Valid
create adult_human(age:15)  # ✗ Constraint violation
```

## Performance Optimization

### Lazy Evaluation

```sigl
# Aliases are evaluated only when used
@alias complex_calculation = human(
    age: random(20,60),
    position: calculate_optimal_position(),
    attributes: generate_random_attributes()
)

# Calculation happens here, not at definition
create complex_calculation
```

### Caching

```sigl
# Cache expensive alias evaluations
@alias @cached expensive_npc = human(
    age: complex_age_calculation(),
    attributes: ai_generated_personality()
)

# First use calculates, subsequent uses retrieve from cache
create expensive_npc at(0,0)
create expensive_npc at(5,0)  # Uses cached result
```

## Integration with Other Systems

### Pattern Integration

```sigl
@alias patterned_clothing(pattern_name) = human(
    clothing: apply_pattern(base_shirt, ${pattern_name})
)

create patterned_clothing(stripes) at(0,0)
```

### Animation Integration

```sigl
@alias animated_guard = human(clothing:armor) with {
    animation: patrol_route(waypoints:[a,b,c,d]),
    behavior: alert_on_approach
}
```

### Expression Integration

```sigl
@alias reactive_npc = human(age:30) with {
    expressions: {
        on_approach: surprised,
        on_talk: friendly,
        on_leave: wave
    }
}
```

## Error Handling

### Undefined Alias Errors

```sigl
create unknown_alias  # Error: Alias 'unknown_alias' not defined
```

### Circular Reference Detection

```sigl
@alias a = b
@alias b = a  # Error: Circular reference detected
```

### Parameter Mismatch

```sigl
@alias parameterized(x, y) = human(age:${x}, emotion:${y})
create parameterized(25)  # Error: Missing parameter 'y'
```

## Best Practices

### Naming Conventions

```sigl
# Use descriptive names
@alias town_guard = human(...)  # ✓ Good
@alias tg = human(...)          # ✗ Poor

# Use consistent prefixes for categories
@alias npc_merchant = human(...)
@alias npc_guard = human(...)
@alias npc_villager = human(...)
```

### Organization

```sigl
# Group related aliases
@collection characters {
    # All character aliases here
}

@collection environments {
    # All environment aliases here
}

@collection items {
    # All item aliases here
}
```

### Documentation

```sigl
# Document complex aliases
@alias complex_boss = human(
    # High-level enemy with multiple phases
    age: 45,
    health: 1000,
    abilities: [fireball, teleport, summon_minions]
) with {
    # Phase-based behavior system
    phases: [aggressive, defensive, desperate]
}
```

## Advanced Features

### Macro-like Aliases

```sigl
@alias create_party(leader_name, size) = {
    create human(name:${leader_name}, role:leader) as @party_leader
    repeat ${size - 1} {
        create human(role:member, follow:@party_leader)
    }
}

# Usage
create_party("Aragorn", 4)  # Creates leader + 3 followers
```

### Conditional Compilation

```sigl
@if debug_mode {
    @alias test_npc = human(name:"DEBUG", visible_stats:true)
} @else {
    @alias test_npc = human(name:"Villager")
}
```

### Version Control

```sigl
@version 1.2
@alias modern_guard = human(clothing:updated_armor, ai:enhanced)

@deprecated old_guard "Use modern_guard instead"
@alias old_guard = human(clothing:basic_armor)
```

## Implementation Notes

- Aliases are resolved at compile time for performance
- Circular dependencies are detected and prevented
- Parameter validation occurs at alias definition
- Collections support nested scoping
- References are tracked for memory management
- Caching is automatic for expensive evaluations

## Future Enhancements

- **AI-Generated Aliases**: Automatic alias creation based on context
- **Dynamic Alias Loading**: Runtime alias definition and modification
- **Alias Analytics**: Usage tracking and optimization suggestions
- **Cross-File Aliases**: Alias sharing between SIGL files
- **Alias Versioning**: Support for multiple versions of the same alias
- **Template Aliases**: Aliases that generate other aliases

## Examples

### Complete Game Scene

```sigl
# Define character archetypes
@collection rpg_characters {
    warrior = human(age:30, clothing:armor, weapon:sword, emotion:brave)
    mage = human(age:25, clothing:robe, weapon:staff, emotion:wise)
    rogue = human(age:22, clothing:dark_leather, weapon:dagger, emotion:sneaky)
    cleric = human(age:35, clothing:white_robe, weapon:mace, emotion:holy)
}

# Create adventure party
scene dungeon_entrance {
    create rpg_characters.warrior as @party_leader at(0,0)
    create rpg_characters.mage as @party_mage at(-1,1)
    create rpg_characters.rogue as @party_rogue at(1,1)
    create rpg_characters.cleric as @party_cleric at(0,2)
    
    # Set up party formation
    @party_mage.follow(@party_leader, offset:(-2,0))
    @party_rogue.follow(@party_leader, offset:(2,0))
    @party_cleric.follow(@party_leader, offset:(0,3))
}
```

This aliasing system provides the foundation for creating maintainable, reusable, and expressive SIGL code that scales from simple character shortcuts to complex scene templates.