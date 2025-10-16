// src/engine/entities/builders/AnimalBuilder.ts
/**
 * Animal Entity Builder
 * Creates various animals with realistic features
 */

import * as THREE from 'three';
import { EntityBuilder } from '../base/EntityBase';
import type { EntityDefinition } from '../../core/types';

export class AnimalBuilder extends EntityBuilder {
  getType(): string {
    return 'animal';
  }
  
  getSubTypes(): string[] {
    return [
      'dog', 'cat', 'bird', 'horse', 'cow',
      'sheep', 'pig', 'rabbit', 'deer', 'bear',
      'lion', 'tiger', 'elephant', 'giraffe'
    ];
  }
  
  build(definition: EntityDefinition): THREE.Group {
    const attrs = definition.attributes as any;
    const group = new THREE.Group();
    
    this.scale = this.calculateScale(definition);
    const subType = attrs.entitySubType || attrs.animalType || 'dog';
    
    switch (subType.toLowerCase()) {
      case 'dog':
        this.buildDog(group, attrs);
        break;
      case 'cat':
        this.buildCat(group, attrs);
        break;
      case 'bird':
        this.buildBird(group, attrs);
        break;
      case 'horse':
        this.buildHorse(group, attrs);
        break;
      default:
        this.buildGenericAnimal(group, attrs);
    }
    
    this.positionEntity(group, definition);
    return group;
  }
  
  private buildDog(group: THREE.Group, attrs: any): void {
    const s = this.scale * 0.5;
    const furColor = attrs.color || '#8B4513';
    const material = this.createMaterial({ color: furColor, roughness: 0.9 });
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.15 * s, 0.18 * s, 0.6 * s, 16);
    bodyGeometry.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.35 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15 * s, 16, 16);
    headGeometry.scale(1.2, 1, 1);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0.4 * s, 0.4 * s, 0);
    this.setupMesh(head);
    group.add(head);
    
    // Snout
    const snoutGeometry = new THREE.CylinderGeometry(0.06 * s, 0.08 * s, 0.15 * s, 12);
    snoutGeometry.rotateZ(Math.PI / 2);
    const snout = new THREE.Mesh(snoutGeometry, material);
    snout.position.set(0.52 * s, 0.35 * s, 0);
    group.add(snout);
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.08 * s, 0.15 * s, 8);
    const leftEar = new THREE.Mesh(earGeometry, material);
    leftEar.position.set(0.35 * s, 0.52 * s, -0.1 * s);
    leftEar.rotation.z = -0.3;
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, material);
    rightEar.position.set(0.35 * s, 0.52 * s, 0.1 * s);
    rightEar.rotation.z = -0.3;
    group.add(rightEar);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.04 * s, 0.05 * s, 0.3 * s, 8);
    const legPositions = [
      [0.2 * s, 0.15 * s, -0.12 * s],
      [0.2 * s, 0.15 * s, 0.12 * s],
      [-0.2 * s, 0.15 * s, -0.12 * s],
      [-0.2 * s, 0.15 * s, 0.12 * s]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
    
    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.02 * s, 0.04 * s, 0.25 * s, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(-0.35 * s, 0.45 * s, 0);
    tail.rotation.z = -0.5;
    group.add(tail);
  }
  
  private buildCat(group: THREE.Group, attrs: any): void {
    const s = this.scale * 0.4;
    const furColor = attrs.color || '#FFB6C1';
    const material = this.createMaterial({ color: furColor, roughness: 0.8 });
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.12 * s, 0.14 * s, 0.5 * s, 16);
    bodyGeometry.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.3 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.12 * s, 16, 16);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0.32 * s, 0.35 * s, 0);
    this.setupMesh(head);
    group.add(head);
    
    // Ears - triangular
    const earGeometry = new THREE.ConeGeometry(0.06 * s, 0.12 * s, 3);
    
    const leftEar = new THREE.Mesh(earGeometry, material);
    leftEar.position.set(0.28 * s, 0.45 * s, -0.08 * s);
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, material);
    rightEar.position.set(0.28 * s, 0.45 * s, 0.08 * s);
    group.add(rightEar);
    
    // Whiskers (thin lines)
    const whiskerMaterial = this.createMaterial({ color: '#FFFFFF' });
    const whiskerGeometry = new THREE.CylinderGeometry(0.005 * s, 0.005 * s, 0.15 * s, 6);
    whiskerGeometry.rotateZ(Math.PI / 2);
    
    for (let i = 0; i < 3; i++) {
      const whisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
      whisker.position.set(0.4 * s, 0.35 * s + (i - 1) * 0.02 * s, 0.08 * s);
      group.add(whisker);
    }
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.03 * s, 0.04 * s, 0.25 * s, 8);
    const legPositions = [
      [0.15 * s, 0.125 * s, -0.1 * s],
      [0.15 * s, 0.125 * s, 0.1 * s],
      [-0.15 * s, 0.125 * s, -0.1 * s],
      [-0.15 * s, 0.125 * s, 0.1 * s]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
    
    // Tail - curved
    const tailGeometry = new THREE.CylinderGeometry(0.02 * s, 0.03 * s, 0.3 * s, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(-0.3 * s, 0.4 * s, 0);
    tail.rotation.z = -0.8;
    group.add(tail);
  }
  
  private buildBird(group: THREE.Group, attrs: any): void {
    const s = this.scale * 0.3;
    const featherColor = attrs.color || '#4169E1';
    const material = this.createMaterial({ color: featherColor });
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(0.12 * s, 16, 16);
    bodyGeometry.scale(1, 1.2, 0.9);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.25 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.08 * s, 12, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0, 0.38 * s, 0.08 * s);
    this.setupMesh(head);
    group.add(head);
    
    // Beak
    const beakGeometry = new THREE.ConeGeometry(0.02 * s, 0.06 * s, 8);
    const beakMaterial = this.createMaterial({ color: '#FFA500' });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.38 * s, 0.14 * s);
    beak.rotation.x = Math.PI / 2;
    group.add(beak);
    
    // Wings
    const wingGeometry = new THREE.SphereGeometry(0.15 * s, 12, 12);
    wingGeometry.scale(0.3, 1, 2);
    
    const leftWing = new THREE.Mesh(wingGeometry, material);
    leftWing.position.set(0, 0.28 * s, -0.15 * s);
    leftWing.rotation.z = 0.3;
    group.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, material);
    rightWing.position.set(0, 0.28 * s, 0.15 * s);
    rightWing.rotation.z = -0.3;
    group.add(rightWing);
    
    // Legs - thin
    const legGeometry = new THREE.CylinderGeometry(0.01 * s, 0.01 * s, 0.1 * s, 6);
    const legMaterial = this.createMaterial({ color: '#FFA500' });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0, 0.15 * s, -0.04 * s);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0, 0.15 * s, 0.04 * s);
    group.add(rightLeg);
  }
  
  private buildHorse(group: THREE.Group, attrs: any): void {
    const s = this.scale * 0.8;
    const furColor = attrs.color || '#8B4513';
    const material = this.createMaterial({ color: furColor, roughness: 0.9 });
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.25 * s, 0.28 * s, 1.0 * s, 16);
    bodyGeometry.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.8 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 0.5 * s, 12);
    const neck = new THREE.Mesh(neckGeometry, material);
    neck.position.set(0.4 * s, 1.1 * s, 0);
    neck.rotation.z = -0.5;
    this.setupMesh(neck);
    group.add(neck);
    
    // Head
    const headGeometry = new THREE.BoxGeometry(0.2 * s, 0.3 * s, 0.15 * s);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0.55 * s, 1.35 * s, 0);
    this.setupMesh(head);
    group.add(head);
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.04 * s, 0.1 * s, 8);
    const leftEar = new THREE.Mesh(earGeometry, material);
    leftEar.position.set(0.5 * s, 1.5 * s, -0.06 * s);
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, material);
    rightEar.position.set(0.5 * s, 1.5 * s, 0.06 * s);
    group.add(rightEar);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.06 * s, 0.08 * s, 0.7 * s, 8);
    const legPositions = [
      [0.3 * s, 0.35 * s, -0.18 * s],
      [0.3 * s, 0.35 * s, 0.18 * s],
      [-0.3 * s, 0.35 * s, -0.18 * s],
      [-0.3 * s, 0.35 * s, 0.18 * s]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
    
    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.03 * s, 0.08 * s, 0.6 * s, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(-0.6 * s, 0.7 * s, 0);
    tail.rotation.z = -0.8;
    group.add(tail);
    
    // Mane
    const maneGeometry = new THREE.BoxGeometry(0.08 * s, 0.3 * s, 0.12 * s);
    const mane = new THREE.Mesh(maneGeometry, material);
    mane.position.set(0.35 * s, 1.25 * s, 0);
    group.add(mane);
  }
  
  private buildGenericAnimal(group: THREE.Group, attrs: any): void {
    const s = this.scale * 0.5;
    const color = attrs.color || '#8B4513';
    const material = this.createMaterial({ color });
    
    // Simple quadruped body
    const bodyGeometry = new THREE.CylinderGeometry(0.15 * s, 0.18 * s, 0.6 * s, 12);
    bodyGeometry.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.35 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.12 * s, 12, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0.35 * s, 0.4 * s, 0);
    this.setupMesh(head);
    group.add(head);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.04 * s, 0.05 * s, 0.3 * s, 8);
    const legPositions = [
      [0.2 * s, 0.15 * s, -0.12 * s],
      [0.2 * s, 0.15 * s, 0.12 * s],
      [-0.2 * s, 0.15 * s, -0.12 * s],
      [-0.2 * s, 0.15 * s, 0.12 * s]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
  }
}

