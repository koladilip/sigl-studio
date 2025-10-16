// src/extensions/hospital/index.ts
/**
 * Hospital Domain Extension
 * Provides entities, attributes, and environments for medical scenarios
 */

import type { Extension, EntityTypeDefinition, EnvironmentTypeDefinition } from '../../core/types';

// Hospital entity definitions
const hospitalEntities: EntityTypeDefinition[] = [
  // Medical Professionals
  {
    name: 'doctor',
    category: 'human',
    attributes: [
      { name: 'specialty', type: 'string', required: false, defaultValue: 'general' },
      { name: 'experience_years', type: 'number', required: false, defaultValue: 10 }
    ],
    defaultValues: {
      age: 40,
      role: 'doctor',
      outfit: 'white_coat'
    }
  },
  {
    name: 'surgeon',
    category: 'human',
    attributes: [
      { name: 'specialty', type: 'string', required: false, defaultValue: 'general_surgery' }
    ],
    defaultValues: {
      age: 45,
      role: 'surgeon',
      outfit: 'surgical_scrubs'
    }
  },
  {
    name: 'nurse',
    category: 'human',
    attributes: [
      { name: 'certification', type: 'string', required: false, defaultValue: 'RN' },
      { name: 'specialty', type: 'string', required: false }
    ],
    defaultValues: {
      age: 35,
      role: 'nurse',
      outfit: 'scrubs'
    }
  },
  {
    name: 'nurse_practitioner',
    category: 'human',
    attributes: [
      { name: 'specialty', type: 'string', required: false }
    ],
    defaultValues: {
      age: 38,
      role: 'nurse_practitioner',
      outfit: 'professional_medical'
    }
  },

  // Patients
  {
    name: 'patient',
    category: 'human',
    attributes: [
      { name: 'condition', type: 'string', required: false, defaultValue: 'stable' },
      { name: 'mobility', type: 'string', required: false, defaultValue: 'ambulatory' }
    ],
    defaultValues: {
      age: 40,
      role: 'patient',
      outfit: 'hospital_gown'
    }
  },

  // Support Staff
  {
    name: 'paramedic',
    category: 'human',
    attributes: [
      { name: 'certification', type: 'string', required: false, defaultValue: 'EMT' }
    ],
    defaultValues: {
      age: 30,
      role: 'paramedic',
      outfit: 'ems_uniform'
    }
  },
  {
    name: 'radiologist',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 42,
      role: 'radiologist',
      outfit: 'white_coat'
    }
  },
  {
    name: 'pharmacist',
    category: 'human',
    attributes: [],
    defaultValues: {
      age: 38,
      role: 'pharmacist',
      outfit: 'white_coat'
    }
  },
  {
    name: 'technician',
    category: 'human',
    attributes: [
      { name: 'specialty', type: 'string', required: false }
    ],
    defaultValues: {
      age: 32,
      role: 'technician',
      outfit: 'scrubs'
    }
  }
];

// Hospital environment definitions
const hospitalEnvironments: EnvironmentTypeDefinition[] = [
  {
    name: 'hospital',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#F0F8FF'  // Alice blue
    },
    defaultLighting: {
      ambient: 0.95
    }
  },
  {
    name: 'examination_room',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#F8F8FF'  // Ghost white
    },
    defaultLighting: {
      ambient: 1.0
    }
  },
  {
    name: 'operating_room',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#E6F3F7'  // Light cyan - sterile
    },
    defaultLighting: {
      ambient: 1.0
    }
  },
  {
    name: 'emergency_room',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#F5F5F5'  // White smoke
    },
    defaultLighting: {
      ambient: 1.0
    }
  },
  {
    name: 'waiting_room',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#FFF8E7'  // Cosmic latte - calming
    },
    defaultLighting: {
      ambient: 0.8
    }
  },
  {
    name: 'patient_room',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#FFF5EE'  // Seashell - warm, comforting
    },
    defaultLighting: {
      ambient: 0.75
    }
  },
  {
    name: 'intensive_care',
    category: 'medical',
    defaultBackground: {
      type: 'solid',
      value: '#F0F8FF'  // Alice blue
    },
    defaultLighting: {
      ambient: 0.9
    }
  }
];

// Export the hospital extension
export const hospitalExtension: Extension = {
  name: 'hospital',
  version: '1.0.0',
  description: 'Hospital domain extension for medical professionals, patients, and medical environments',
  
  entities: hospitalEntities,
  environments: hospitalEnvironments,
  
  async initialize() {
    console.log('Hospital extension loaded');
  },
  
  async cleanup() {
    console.log('Hospital extension unloaded');
  }
};

export default hospitalExtension;

