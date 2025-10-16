# Animation System

## Overview

The Animation System in SIGL enables dynamic movement and behavior for entities, bringing static scenes to life with smooth transitions, character movements, and interactive elements. This system supports both simple animations and complex sequences across all domain extensions.

## Core Principles

- **Entity-Centric Animations**: Any drawable entity can be animated
- **Timeline-Based Control**: Precise timing and sequencing of animations
- **Reusable Animation Presets**: Define and reuse common animation patterns
- **Cross-Domain Compatibility**: Animations work across all extensions
- **Performance Optimization**: Efficient rendering for smooth playback

## Basic Animation Syntax

### Simple Animation Commands
```sigl
ANIMATE <ENTITY> <ACTION> [WITH <PARAMETERS>]
```

**Examples:**
```sigl
ANIMATE MAN WALK FROM LEFT TO RIGHT
ANIMATE WOMAN WAVE WITH DURATION 2S
ANIMATE CAR MOVE FROM BOTTOM TO TOP WITH SPEED FAST
```

### Animation with Entity Definition
```sigl
DRAW <ENTITY> WITH ANIMATION(<ACTION>, <PARAMETERS>)
```

**Examples:**
```sigl
DRAW MAN WITH ANIMATION(WALK, FROM: LEFT, TO: RIGHT, SPEED: MEDIUM)
DRAW BIRD WITH ANIMATION(FLY, FROM: BOTTOM, TO: TOP, REPEAT: INFINITE)
```

## Animation Types

### Movement Animations
- `WALK` - Natural walking motion
- `RUN` - Running movement
- `JUMP` - Jumping action
- `MOVE` - Generic movement (for objects)
- `FLY` - Flying motion (for birds, aircraft)
- `SWIM` - Swimming motion (for fish, people in water)
- `FLOAT` - Floating motion (for astronauts, balloons)

### Gesture Animations
- `WAVE` - Hand waving
- `POINT` - Pointing gesture
- `NOD` - Head nodding
- `SHAKE_HEAD` - Head shaking
- `CLAP` - Hand clapping
- `SALUTE` - Military salute

### Object Animations
- `ROTATE` - Rotation around center
- `SCALE` - Size changes
- `FADE` - Opacity changes
- `BOUNCE` - Bouncing motion
- `SWAY` - Gentle swaying (trees, flags)
- `SPIN` - Fast rotation

### Complex Animations
- `DANCE` - Dancing movements
- `MARCH` - Military marching
- `WORK` - Work-related actions
- `PLAY` - Playful activities

## Animation Parameters

### Timing Parameters
```sigl
ANIMATE ENTITY ACTION WITH DURATION <TIME>
ANIMATE ENTITY ACTION WITH DELAY <TIME>
ANIMATE ENTITY ACTION WITH REPEAT <COUNT>
```

**Examples:**
```sigl
ANIMATE MAN WALK WITH DURATION 3S
ANIMATE WOMAN WAVE WITH DELAY 1S AND DURATION 2S
ANIMATE BIRD FLY WITH REPEAT INFINITE
ANIMATE CAR MOVE WITH REPEAT 3
```

### Movement Parameters
```sigl
ANIMATE ENTITY MOVE FROM <START> TO <END> WITH SPEED <RATE>
```

**Speed Options:**
- `SLOW`
- `MEDIUM` (default)
- `FAST`
- `VERY_FAST`

**Position Options:**
- `LEFT`, `RIGHT`, `TOP`, `BOTTOM`
- `CENTER`
- `TOP_LEFT`, `TOP_RIGHT`, `BOTTOM_LEFT`, `BOTTOM_RIGHT`
- Coordinates: `(X, Y)`

### Easing and Style
```sigl
ANIMATE ENTITY ACTION WITH EASING <TYPE>
```

**Easing Types:**
- `LINEAR` (default)
- `EASE_IN`
- `EASE_OUT`
- `EASE_IN_OUT`
- `BOUNCE`
- `ELASTIC`

## Animation Sequences

### Sequential Animations
```sigl
CREATE ANIMATION SEQUENCE "morning_routine":
  ANIMATE MAN WALK FROM LEFT TO CENTER WITH DURATION 2S
  THEN ANIMATE MAN WAVE WITH DURATION 1S
  THEN ANIMATE MAN WALK FROM CENTER TO RIGHT WITH DURATION 2S
```

### Parallel Animations
```sigl
CREATE ANIMATION GROUP "crowd_scene":
  ANIMATE MAN1 WALK FROM LEFT TO RIGHT
  SIMULTANEOUSLY ANIMATE WOMAN1 WALK FROM RIGHT TO LEFT
  SIMULTANEOUSLY ANIMATE CHILD1 JUMP AT CENTER
```

### Conditional Animations
```sigl
ANIMATE MAN WALK FROM LEFT TO CENTER
ON COMPLETE: ANIMATE MAN WAVE
ON COMPLETE: ANIMATE WOMAN WAVE IN RESPONSE
```

## Domain-Specific Animations

### Hospital Domain
```sigl
LOAD EXTENSION hospital
ANIMATE DOCTOR WALK FROM DOOR TO PATIENT WITH URGENCY HIGH
ANIMATE NURSE RUN FROM STATION TO EMERGENCY_ROOM
ANIMATE PATIENT BREATHE WITH RHYTHM SLOW
```

### Military Domain
```sigl
LOAD EXTENSION military
ANIMATE SOLDIER MARCH FROM BARRACKS TO FORMATION
ANIMATE TROOPS SALUTE WITH SYNCHRONIZATION PERFECT
ANIMATE VEHICLE PATROL FROM CHECKPOINT TO CHECKPOINT
```

### Space Domain
```sigl
LOAD EXTENSION space
ANIMATE ASTRONAUT FLOAT FROM AIRLOCK TO STATION
ANIMATE SPACECRAFT ORBIT AROUND PLANET WITH PERIOD 30S
ANIMATE SATELLITE ROTATE WITH SPEED SLOW
```

### Educational Domain
```sigl
LOAD EXTENSION educational
ANIMATE TEACHER POINT TO BLACKBOARD
ANIMATE STUDENTS RAISE_HANDS IN SEQUENCE
ANIMATE BOOK PAGES TURN WITH SPEED MEDIUM
```

## Animation Presets and Templates

### Defining Animation Presets
```sigl
DEFINE ANIMATION "casual_walk":
  WALK(SPEED: MEDIUM, STYLE: RELAXED, DURATION: 3S)

DEFINE ANIMATION "urgent_run":
  RUN(SPEED: FAST, STYLE: URGENT, DURATION: 2S)
```

### Using Animation Presets
```sigl
ANIMATE MAN WITH PRESET "casual_walk" FROM LEFT TO RIGHT
ANIMATE DOCTOR WITH PRESET "urgent_run" FROM OFFICE TO PATIENT
```

### Animation Variations
```sigl
DEFINE VARIATION "happy_character":
  ANIMATION(WALK, STYLE: BOUNCY, EXPRESSION: HAPPY)

DRAW MAN WITH VARIATION "happy_character"
ANIMATE "happy_character" WALK FROM LEFT TO RIGHT
```

## Interactive Animations

### Event-Triggered Animations
```sigl
ON CLICK DOCTOR: ANIMATE DOCTOR WAVE
ON HOVER PATIENT: ANIMATE PATIENT LOOK_UP
ON TIMER 5S: ANIMATE NURSE WALK TO PATIENT
```

### State-Based Animations
```sigl
IF PATIENT.STATUS = CRITICAL:
  ANIMATE DOCTOR RUN TO PATIENT
ELSE:
  ANIMATE DOCTOR WALK TO PATIENT
```

### User-Controlled Animations
```sigl
ENABLE USER_CONTROL FOR MAN:
  ARROW_KEYS: MOVE
  SPACEBAR: JUMP
  CLICK: WAVE
```

## Animation Integration with Other Systems

### Animations with Patterns
```sigl
DRAW WOMAN WITH DRESS(PATTERN: FLORAL) AND ANIMATION(DANCE)
ANIMATE WOMAN SPIN // Dress pattern rotates with character
```

### Animations with Aliasing
```sigl
DEFINE WOMAN AS "dancing_lady" WITH ANIMATION(DANCE, REPEAT: INFINITE)
DRAW "dancing_lady" AT CENTER
ANIMATE "dancing_lady" MOVE TO RIGHT // Continues dancing while moving
```

### Animations with Expressions
```sigl
ANIMATE MAN WALK WITH EXPRESSION: HAPPY
ANIMATE WOMAN RUN WITH MOOD: EXCITED
```

## Performance and Optimization

### Animation Batching
```sigl
CREATE ANIMATION BATCH "crowd_movement":
  ANIMATE PERSON1 WALK FROM A TO B
  ANIMATE PERSON2 WALK FROM C TO D
  ANIMATE PERSON3 WALK FROM E TO F
EXECUTE BATCH WITH OPTIMIZATION HIGH
```

### Frame Rate Control
```sigl
SET ANIMATION FRAMERATE 30 // 30 FPS
SET ANIMATION QUALITY MEDIUM // Balance performance and smoothness
```

### Memory Management
```sigl
PRELOAD ANIMATIONS "walk", "run", "wave" // Cache common animations
CLEANUP ANIMATIONS AFTER SCENE_COMPLETE // Free memory
```

## Advanced Animation Features

### Physics-Based Animations
```sigl
ANIMATE BALL BOUNCE WITH PHYSICS GRAVITY
ANIMATE CLOTH SWAY WITH PHYSICS WIND
ANIMATE WATER FLOW WITH PHYSICS FLUID
```

### Particle Animations
```sigl
ANIMATE FIRE FLICKER WITH PARTICLES FLAME
ANIMATE SMOKE RISE WITH PARTICLES WISPY
ANIMATE RAIN FALL WITH PARTICLES WATER
```

### Morphing Animations
```sigl
ANIMATE CATERPILLAR TRANSFORM TO BUTTERFLY WITH DURATION 5S
ANIMATE SEED GROW TO TREE WITH STAGES 4
```

## Error Handling

### Invalid Animation Types
```sigl
ANIMATE MAN TELEPORT
// Error: Invalid animation "TELEPORT" for MAN. Available: WALK, RUN, JUMP, etc.
```

### Conflicting Animations
```sigl
ANIMATE MAN WALK AND RUN
// Error: Multiple movement animations specified. Choose one.
```

### Performance Warnings
```sigl
ANIMATE 100 ENTITIES SIMULTANEOUSLY
// Warning: High entity count may impact performance. Consider batching.
```

## Implementation Notes

### Animation Engine
- Use CSS transitions and keyframes for web-based animations
- Support Canvas-based sprite animations for complex movements
- Implement timeline management for sequence control

### Asset Management
- Store animation sprites and keyframes efficiently
- Support both vector and raster animation assets
- Implement animation compression for web delivery

### Browser Compatibility
- Fallback to static images for unsupported browsers
- Progressive enhancement for advanced animation features
- Mobile-optimized animation performance

## Future Enhancements

- **Motion Capture Integration**: Import real motion data
- **AI-Generated Animations**: Procedural animation generation
- **VR/AR Support**: 3D animation capabilities
- **Real-Time Physics**: Advanced physics simulation
- **Collaborative Animations**: Multi-user synchronized animations

## Examples and Use Cases

### Educational Animation
```sigl
CREATE SCENE "solar_system":
  DRAW SUN AT CENTER
  DRAW EARTH WITH ANIMATION(ORBIT, AROUND: SUN, PERIOD: 10S)
  DRAW MOON WITH ANIMATION(ORBIT, AROUND: EARTH, PERIOD: 2S)
```

### Storytelling Animation
```sigl
CREATE SCENE "fairy_tale":
  ANIMATE PRINCESS WALK FROM CASTLE TO FOREST
  ON ARRIVAL: ANIMATE DRAGON APPEAR WITH EFFECT SMOKE
  ANIMATE KNIGHT RIDE FROM VILLAGE TO FOREST
  ON ARRIVAL: ANIMATE BATTLE SEQUENCE
```

### Medical Training Animation
```sigl
LOAD EXTENSION hospital
CREATE SCENE "cpr_training":
  ANIMATE INSTRUCTOR DEMONSTRATE CPR_TECHNIQUE
  ANIMATE STUDENT PRACTICE CPR_TECHNIQUE
  ANIMATE MANNEQUIN RESPOND TO CPR
```