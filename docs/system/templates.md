# SITL Template System

## Overview

The SITL Template System provides a powerful framework for creating reusable, parameterized scene components and entity configurations. Templates enable developers to define complex structures once and instantiate them multiple times with different parameters, promoting code reusability and maintainability.

## Core Principles

1. **Reusability**: Define once, use many times
2. **Parameterization**: Flexible customization through parameters
3. **Modularity**: Composable template components
4. **Inheritance**: Template extension and specialization
5. **Integration**: Seamless integration with aliasing and other SITL systems

## Basic Template Syntax

### Simple Templates

```sitl
// Define a basic template
TEMPLATE basic_room(width, height) {
    ADD ROOM WITH SIZE(${width}, ${height})
    ADD FLOOR WITH MATERIAL(WOOD)
    ADD WALLS WITH COLOR(WHITE)
}

// Use the template
CREATE basic_room(10, 8)
CREATE basic_room(15, 12)
```

### Entity Templates

```sitl
// Character template
TEMPLATE guard_character(weapon_type, position) {
    DRAW MAN WITH AGE(30-40) AND CLOTHING(ARMOR) AND WEAPON(${weapon_type}) AT ${position}
    SET BEHAVIOR(PATROL)
    SET ALERT_LEVEL(HIGH)
}

// Usage
CREATE guard_character(SWORD, (0,0))
CREATE guard_character(SPEAR, (10,0))
CREATE guard_character(BOW, (5,10))
```

## Template Parameters

### Parameter Types

```sitl
// Different parameter types
TEMPLATE flexible_character(
    name: STRING,
    age: INTEGER,
    position: COORDINATE,
    clothing_style: ENUM[CASUAL, FORMAL, ARMOR],
    optional_weapon: OPTIONAL[WEAPON] = NONE
) {
    DRAW HUMAN WITH NAME(${name}) AND AGE(${age}) AND CLOTHING(${clothing_style}) AT ${position}
    IF ${optional_weapon} != NONE {
        ADD WEAPON(${optional_weapon})
    }
}

// Usage with different parameter types
CREATE flexible_character("Alice", 25, (0,0), CASUAL)
CREATE flexible_character("Bob", 30, (5,0), ARMOR, SWORD)
```

### Default Parameters

```sitl
// Template with default values
TEMPLATE village_house(
    size: INTEGER = 8,
    color: COLOR = BROWN,
    roof_type: STRING = "THATCH",
    has_garden: BOOLEAN = TRUE
) {
    ADD HOUSE WITH SIZE(${size}) AND COLOR(${color}) AND ROOF(${roof_type})
    IF ${has_garden} {
        ADD GARDEN WITH FLOWERS
    }
}

// Usage with defaults
CREATE village_house()  // Uses all defaults
CREATE village_house(12, RED)  // Overrides size and color
CREATE village_house(has_garden: FALSE)  // Named parameter override
```

## Aliasing Integration

### Template-Alias Combinations

```sitl
// Define aliases for use in templates
@alias warrior_gear = clothing:armor, weapon:sword, shield:round
@alias mage_gear = clothing:robe, weapon:staff, accessory:hat
@alias archer_gear = clothing:leather, weapon:bow, accessory:quiver

// Template using aliases
TEMPLATE party_member(role, position, level) {
    SWITCH ${role} {
        CASE "WARRIOR":
            DRAW HUMAN WITH warrior_gear AND LEVEL(${level}) AT ${position}
        CASE "MAGE":
            DRAW HUMAN WITH mage_gear AND LEVEL(${level}) AT ${position}
        CASE "ARCHER":
            DRAW HUMAN WITH archer_gear AND LEVEL(${level}) AT ${position}
    }
}

// Usage
CREATE party_member("WARRIOR", (0,0), 5)
CREATE party_member("MAGE", (-2,2), 7)
CREATE party_member("ARCHER", (2,2), 4)
```

### Alias Collections in Templates

```sitl
// Use alias collections within templates
@collection npc_types {
    merchant = human(age:40, clothing:fine, emotion:friendly)
    guard = human(age:35, clothing:armor, emotion:alert)
    villager = human(age:25, clothing:casual, emotion:content)
    child = human(age:10, clothing:simple, emotion:playful)
}

TEMPLATE town_square(size, population_density) {
    ADD SQUARE WITH SIZE(${size})
    
    // Calculate NPC count based on density
    SET npc_count = ${size} * ${population_density}
    
    REPEAT ${npc_count / 4} {
        CREATE npc_types.merchant AT RANDOM_POSITION(MARKET_AREA)
    }
    REPEAT ${npc_count / 6} {
        CREATE npc_types.guard AT RANDOM_POSITION(PATROL_POINTS)
    }
    REPEAT ${npc_count / 2} {
        CREATE npc_types.villager AT RANDOM_POSITION(GENERAL_AREA)
    }
    REPEAT ${npc_count / 8} {
        CREATE npc_types.child AT RANDOM_POSITION(SAFE_AREAS)
    }
}
```

### Dynamic Alias Creation in Templates

```sitl
// Templates that create aliases dynamically
TEMPLATE character_family(family_name, member_count, base_traits) {
    // Create family-specific aliases
    @alias family_traits = ${base_traits} + surname:${family_name}
    
    REPEAT ${member_count} {
        @alias family_member_${INDEX} = human(family_traits, age:RANDOM(20,60))
        CREATE family_member_${INDEX} AT FAMILY_HOME_${INDEX}
    }
    
    // Create family group reference
    @collection ${family_name}_family {
        // Dynamically populated with family members
    }
}

// Usage
CREATE character_family("Smith", 4, {profession:blacksmith, wealth:moderate})
CREATE character_family("Baker", 3, {profession:baker, wealth:comfortable})
```

## Template Inheritance

### Base Templates

```sitl
// Base building template
TEMPLATE base_building(width, height, material) {
    ADD FOUNDATION WITH SIZE(${width}, ${height})
    ADD WALLS WITH MATERIAL(${material})
    ADD ROOF WITH STYLE(BASIC)
}

// Specialized building templates
TEMPLATE house EXTENDS base_building(
    door_count: INTEGER = 1,
    window_count: INTEGER = 4
) {
    REPEAT ${door_count} {
        ADD DOOR AT RANDOM_WALL_POSITION
    }
    REPEAT ${window_count} {
        ADD WINDOW AT RANDOM_WALL_POSITION
    }
    ADD INTERIOR WITH STYLE(RESIDENTIAL)
}

TEMPLATE shop EXTENDS base_building(
    shop_type: STRING,
    display_windows: INTEGER = 2
) {
    REPEAT ${display_windows} {
        ADD DISPLAY_WINDOW AT FRONT_WALL
    }
    ADD INTERIOR WITH STYLE(COMMERCIAL, ${shop_type})
    ADD SIGN WITH TEXT(${shop_type})
}
```

### Multiple Inheritance

```sitl
// Multiple base templates
TEMPLATE defensive_structure {
    ADD FORTIFICATION
    SET DEFENSE_RATING(HIGH)
}

TEMPLATE residential_structure {
    ADD LIVING_QUARTERS
    SET COMFORT_RATING(MEDIUM)
}

// Template inheriting from multiple bases
TEMPLATE fortified_house EXTENDS defensive_structure, residential_structure {
    ADD WATCHTOWER
    ADD SECURE_ENTRANCE
    BALANCE DEFENSE_RATING WITH COMFORT_RATING
}
```

## Advanced Template Features

### Conditional Templates

```sitl
// Templates with conditional logic
TEMPLATE adaptive_character(environment, threat_level) {
    IF ${environment} == "FOREST" {
        DRAW HUMAN WITH CLOTHING(RANGER) AND SKILL(TRACKING)
    } ELSE IF ${environment} == "CITY" {
        DRAW HUMAN WITH CLOTHING(URBAN) AND SKILL(STREETWISE)
    } ELSE IF ${environment} == "DUNGEON" {
        DRAW HUMAN WITH CLOTHING(ARMOR) AND SKILL(COMBAT)
    }
    
    IF ${threat_level} > 5 {
        ADD WEAPON(APPROPRIATE_FOR_ENVIRONMENT)
        SET ALERTNESS(HIGH)
    }
}
```

### Nested Templates

```sitl
// Templates that use other templates
TEMPLATE room_with_furniture(room_type, size) {
    CREATE basic_room(${size}, ${size})
    
    SWITCH ${room_type} {
        CASE "BEDROOM":
            CREATE bedroom_furniture_set()
        CASE "KITCHEN":
            CREATE kitchen_furniture_set()
        CASE "LIBRARY":
            CREATE library_furniture_set()
    }
}

TEMPLATE bedroom_furniture_set() {
    ADD BED AT CENTER
    ADD DRESSER AT WALL
    ADD NIGHTSTAND NEAR BED
}
```

### Recursive Templates

```sitl
// Self-referencing templates for complex structures
TEMPLATE fractal_building(depth, size) {
    ADD BUILDING WITH SIZE(${size})
    
    IF ${depth} > 0 {
        CREATE fractal_building(${depth - 1}, ${size / 2}) AT CORNER_1
        CREATE fractal_building(${depth - 1}, ${size / 2}) AT CORNER_2
        CREATE fractal_building(${depth - 1}, ${size / 2}) AT CORNER_3
        CREATE fractal_building(${depth - 1}, ${size / 2}) AT CORNER_4
    }
}
```

## Template Collections

### Grouped Templates

```sitl
// Organize related templates
TEMPLATE_COLLECTION medieval_buildings {
    TEMPLATE castle(size, defense_level) {
        ADD CASTLE WITH SIZE(${size}) AND DEFENSES(${defense_level})
        ADD MOAT IF ${defense_level} > 7
        ADD DRAWBRIDGE
    }
    
    TEMPLATE village_house(wealth_level) {
        IF ${wealth_level} > 5 {
            CREATE house(8, 6, STONE)
        } ELSE {
            CREATE house(6, 4, WOOD)
        }
    }
    
    TEMPLATE blacksmith_shop() {
        CREATE shop("BLACKSMITH", 1)
        ADD FORGE
        ADD ANVIL
        ADD TOOL_RACK
    }
}

// Usage
CREATE medieval_buildings.castle(LARGE, 8)
CREATE medieval_buildings.village_house(3)
CREATE medieval_buildings.blacksmith_shop()
```

### Template Libraries

```sitl
// Import template collections
IMPORT TEMPLATE_LIBRARY "fantasy_characters"
IMPORT TEMPLATE_LIBRARY "modern_vehicles"
IMPORT TEMPLATE_LIBRARY "sci_fi_environments"

// Use imported templates
CREATE fantasy_characters.wizard(LEVEL: 10, SCHOOL: EVOCATION)
CREATE modern_vehicles.sports_car(COLOR: RED, SPEED: HIGH)
CREATE sci_fi_environments.space_station(SIZE: MASSIVE, TECH_LEVEL: ADVANCED)
```

## Template Validation

### Parameter Validation

```sitl
// Templates with parameter constraints
TEMPLATE validated_character(
    age: INTEGER RANGE(0, 100),
    name: STRING LENGTH(1, 50),
    position: COORDINATE WITHIN_BOUNDS(SCENE),
    equipment: LIST[ITEM] MAX_COUNT(10)
) {
    VALIDATE age >= 18 OR role != "ADULT"
    VALIDATE name NOT_EMPTY
    VALIDATE position NOT_OCCUPIED
    
    DRAW HUMAN WITH AGE(${age}) AND NAME(${name}) AT ${position}
    FOR item IN ${equipment} {
        ADD ITEM(${item})
    }
}
```

### Template Testing

```sitl
// Template unit tests
TEST_TEMPLATE guard_character {
    TEST "creates guard with sword" {
        RESULT = CREATE guard_character(SWORD, (0,0))
        ASSERT RESULT.weapon == SWORD
        ASSERT RESULT.position == (0,0)
        ASSERT RESULT.clothing == ARMOR
    }
    
    TEST "creates guard with bow" {
        RESULT = CREATE guard_character(BOW, (5,5))
        ASSERT RESULT.weapon == BOW
        ASSERT RESULT.has_skill(ARCHERY)
    }
}
```

## Performance Optimization

### Template Caching

```sitl
// Cache expensive template instantiations
TEMPLATE @cached complex_scene(parameters) {
    // Expensive calculations here
    GENERATE PROCEDURAL_TERRAIN(${parameters})
    POPULATE WITH AI_GENERATED_NPCS(${parameters})
}

// First use calculates, subsequent uses retrieve from cache
CREATE complex_scene(FOREST_PARAMS)
CREATE complex_scene(FOREST_PARAMS)  // Uses cached result
```

### Lazy Template Loading

```sitl
// Load templates only when needed
TEMPLATE @lazy massive_dungeon(floors, complexity) {
    // Only instantiated when actually used
    FOR floor IN 1..${floors} {
        GENERATE DUNGEON_FLOOR(${complexity})
    }
}
```

## Integration with Other Systems

### Pattern Integration

```sitl
// Templates using pattern system
TEMPLATE patterned_clothing_shop(pattern_style) {
    CREATE shop("TAILOR", 3)
    
    FOR clothing_type IN [SHIRT, DRESS, PANTS] {
        ADD DISPLAY_ITEM(
            TYPE: ${clothing_type},
            PATTERN: ${pattern_style}
        )
    }
}

CREATE patterned_clothing_shop(FLORAL)
CREATE patterned_clothing_shop(GEOMETRIC)
```

### Animation Integration

```sitl
// Templates with built-in animations
TEMPLATE animated_marketplace() {
    CREATE town_square(20, MEDIUM)
    
    // Add animated merchants
    CREATE npc_types.merchant WITH ANIMATION(
        SEQUENCE: [ARRANGE_GOODS, CALL_CUSTOMERS, MAKE_SALE],
        LOOP: TRUE
    )
    
    // Add wandering customers
    CREATE npc_types.villager WITH ANIMATION(
        PATTERN: RANDOM_WALK,
        AREA: MARKET_BOUNDS
    )
}
```

### Expression Integration

```sitl
// Templates with interactive characters
TEMPLATE interactive_inn() {
    CREATE building(INN, MEDIUM)
    
    CREATE human(role:innkeeper) WITH {
        expressions: {
            on_customer_enter: welcoming,
            on_order: attentive,
            on_payment: grateful
        },
        dialogue_tree: inn_keeper_conversations
    } AT BAR_POSITION
    
    CREATE human(role:bard) WITH {
        expressions: {
            while_performing: passionate,
            on_applause: proud,
            on_request: thoughtful
        },
        animation: PLAY_MUSIC
    } AT STAGE_POSITION
}
```

## Error Handling

### Template Error Recovery

```sitl
// Templates with error handling
TEMPLATE robust_character(name, fallback_name) {
    TRY {
        DRAW HUMAN WITH NAME(${name})
    } CATCH INVALID_NAME {
        DRAW HUMAN WITH NAME(${fallback_name})
        LOG WARNING("Invalid name '${name}', using fallback '${fallback_name}'")
    }
}
```

### Missing Parameter Handling

```sitl
// Handle missing or invalid parameters
TEMPLATE defensive_template(
    required_param: REQUIRED,
    optional_param: OPTIONAL = DEFAULT_VALUE
) {
    VALIDATE required_param IS_PROVIDED
    
    IF optional_param IS_MISSING {
        SET optional_param = CALCULATE_DEFAULT(required_param)
    }
    
    // Template implementation
}
```

## Best Practices

### Template Organization

```sitl
// Organize templates by domain
NAMESPACE characters {
    TEMPLATE hero(class, level) { /* ... */ }
    TEMPLATE villain(threat_level) { /* ... */ }
    TEMPLATE npc(role, personality) { /* ... */ }
}

NAMESPACE environments {
    TEMPLATE dungeon(size, difficulty) { /* ... */ }
    TEMPLATE town(population, wealth) { /* ... */ }
    TEMPLATE wilderness(terrain, danger) { /* ... */ }
}

// Usage with namespaces
CREATE characters.hero(WARRIOR, 10)
CREATE environments.dungeon(LARGE, HARD)
```

### Documentation Standards

```sitl
/**
 * Creates a fully equipped adventuring party
 * @param party_size Number of party members (3-6)
 * @param average_level Average level of party members
 * @param party_composition Roles to include in party
 * @returns Reference to created party group
 */
TEMPLATE adventuring_party(
    party_size: INTEGER RANGE(3, 6),
    average_level: INTEGER RANGE(1, 20),
    party_composition: LIST[ROLE] = [WARRIOR, MAGE, CLERIC, ROGUE]
) {
    // Implementation with clear comments
}
```

### Version Control

```sitl
// Template versioning
TEMPLATE @version(2.1) modern_character(params) {
    // Updated implementation
}

TEMPLATE @deprecated("Use modern_character instead") old_character(params) {
    // Legacy implementation
}
```

## Future Enhancements

- **AI-Generated Templates**: Automatic template creation based on usage patterns
- **Visual Template Editor**: GUI for template creation and modification
- **Template Marketplace**: Sharing and downloading community templates
- **Cross-Platform Templates**: Templates that work across different SITL implementations
- **Template Analytics**: Usage tracking and optimization suggestions
- **Dynamic Template Modification**: Runtime template editing and hot-reloading

## Implementation Notes

- Templates are compiled at parse time for performance
- Parameter validation occurs before template instantiation
- Template inheritance supports multiple levels of nesting
- Circular template dependencies are detected and prevented
- Memory usage is optimized through template instance pooling

This template system, combined with the aliasing system, provides a powerful foundation for creating complex, reusable SITL content that scales from simple character definitions to complete interactive worlds.