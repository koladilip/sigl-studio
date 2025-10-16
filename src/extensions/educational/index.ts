// src/extensions/educational/index.ts
/**
 * Educational Domain Extension
 * Provides entities, attributes, and environments for educational scenarios
 */

import type { Extension, EntityTypeDefinition, EnvironmentTypeDefinition } from '../../core/types';

// Educational entity definitions
const educationalEntities: EntityTypeDefinition[] = [
  // Teaching Staff
  {
    name: 'teacher',
    category: 'human',
    attributes: [
      { name: 'subject', type: 'string', required: false, defaultValue: 'general' },
      { name: 'grade_level', type: 'string', required: false, defaultValue: 'elementary' },
      { name: 'experience', type: 'string', required: false, defaultValue: 'intermediate' }
    ],
    defaultValues: {
      age: 35,
      role: 'teacher',
      outfit: 'professional_casual'
    }
  },
  {
    name: 'professor',
    category: 'human',
    attributes: [
      { name: 'subject', type: 'string', required: false, defaultValue: 'general' },
      { name: 'tenure', type: 'boolean', required: false, defaultValue: false }
    ],
    defaultValues: {
      age: 45,
      role: 'professor',
      outfit: 'academic_professional'
    }
  },
  {
    name: 'instructor',
    category: 'human',
    attributes: [
      { name: 'specialization', type: 'string', required: false }
    ],
    defaultValues: {
      age: 32,
      role: 'instructor',
      outfit: 'business_casual'
    }
  },

  // Students
  {
    name: 'student',
    category: 'human',
    attributes: [
      { name: 'grade', type: 'number', required: false, defaultValue: 8 },
      { name: 'performance', type: 'string', required: false, defaultValue: 'average' }
    ],
    defaultValues: {
      age: 15,
      role: 'student',
      outfit: 'casual_school'
    }
  },
  {
    name: 'elementary_student',
    category: 'human',
    attributes: [
      { name: 'grade', type: 'number', required: false, defaultValue: 3 }
    ],
    defaultValues: {
      age: 8,
      role: 'student',
      outfit: 'school_uniform'
    }
  },
  {
    name: 'high_school_student',
    category: 'human',
    attributes: [
      { name: 'grade', type: 'number', required: false, defaultValue: 10 }
    ],
    defaultValues: {
      age: 16,
      role: 'student',
      outfit: 'casual_trendy'
    }
  },
  {
    name: 'college_student',
    category: 'human',
    attributes: [
      { name: 'major', type: 'string', required: false }
    ],
    defaultValues: {
      age: 20,
      role: 'student',
      outfit: 'casual_independent'
    }
  },

  // Administrative Staff
  {
    name: 'principal',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 50,
      role: 'principal',
      outfit: 'formal_professional'
    }
  },
  {
    name: 'vice_principal',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 45,
      role: 'vice_principal',
      outfit: 'formal_professional'
    }
  },
  {
    name: 'guidance_counselor',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 38,
      role: 'counselor',
      outfit: 'approachable_professional'
    }
  },

  // Support Staff
  {
    name: 'librarian',
    category: 'human',
    attributes: [
      { name: 'specialization', type: 'string', required: false, defaultValue: 'general' }
    ],
    defaultValues: {
      age: 40,
      role: 'librarian',
      outfit: 'professional_accessible'
    }
  },
  {
    name: 'custodian',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 45,
      role: 'custodian',
      outfit: 'work_uniform'
    }
  }
];

// Educational environment definitions
const educationalEnvironments: EnvironmentTypeDefinition[] = [
  {
    name: 'classroom',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#FFF8DC'  // Cornsilk - warm, educational
    },
    defaultLighting: {
      ambient: 0.9
    }
  },
  {
    name: 'lecture_hall',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#F5F5DC'  // Beige
    },
    defaultLighting: {
      ambient: 0.8
    }
  },
  {
    name: 'laboratory',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#F0F8FF'  // Alice blue - clean, clinical
    },
    defaultLighting: {
      ambient: 1.0
    }
  },
  {
    name: 'library',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#F4F1E8'  // Warm gray - quiet, studious
    },
    defaultLighting: {
      ambient: 0.7
    }
  },
  {
    name: 'gymnasium',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#E8E8E8'  // Light gray
    },
    defaultLighting: {
      ambient: 0.95
    }
  },
  {
    name: 'cafeteria',
    category: 'educational',
    defaultBackground: {
      type: 'solid',
      value: '#FFF5EE'  // Seashell - warm, welcoming
    },
    defaultLighting: {
      ambient: 0.85
    }
  },
  {
    name: 'playground',
    category: 'educational',
    defaultBackground: {
      type: 'gradient',
      value: {
        type: 'linear',
        colors: ['#87CEEB', '#90EE90'],
        angle: 180
      }
    },
    defaultLighting: {
      ambient: 1.0
    }
  }
];

// Export the educational extension
export const educationalExtension: Extension = {
  name: 'educational',
  version: '1.0.0',
  description: 'Educational domain extension for schools, teachers, students, and learning environments',
  
  entities: educationalEntities,
  environments: educationalEnvironments,
  
  async initialize() {
    // Extension initialization logic
    console.log('Educational extension loaded');
  },
  
  async cleanup() {
    // Cleanup logic
    console.log('Educational extension unloaded');
  }
};

export default educationalExtension;

