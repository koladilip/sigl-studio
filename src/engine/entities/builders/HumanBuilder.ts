// src/engine/entities/builders/HumanBuilder.ts
/**
 * Human Entity Builder
 * Creates realistic 3D human figures with detailed anatomy
 */

import * as THREE from 'three';
import { EntityBuilder, EntityColors } from '../base/EntityBase';
import type { EntityDefinition } from '../../core/types';

export class HumanBuilder extends EntityBuilder {
  getType(): string {
    return 'human';
  }
  
  getSubTypes(): string[] {
    return [
      'adult_male', 'adult_female', 'adult_neutral',
      'child_male', 'child_female', 'child_neutral',
      'infant', 'toddler', 'teenager',
      'elderly_male', 'elderly_female'
    ];
  }
  
  build(definition: EntityDefinition): THREE.Group {
    const attrs = definition.attributes as any;
    const group = new THREE.Group();
    
    this.scale = this.calculateScale(definition);
    
    // Extract attributes
    const skinColor = EntityColors.getSkinColor(attrs.appearance?.skin);
    const hairColor = EntityColors.getHairColor(attrs.appearance?.hair || attrs.hair?.color);
    const eyeColor = EntityColors.getEyeColor(attrs.appearance?.eyes);
    const clothing = attrs.clothing || {};
    
    // Build body parts
    this.buildHead(group, skinColor, hairColor, eyeColor, attrs);
    this.buildBody(group, skinColor, clothing, attrs);
    this.buildLimbs(group, skinColor, clothing, attrs);
    
    // Position in world
    this.positionEntity(group, definition);
    
    return group;
  }
  
  /**
   * Build head with facial features
   */
  private buildHead(
    group: THREE.Group,
    skinColor: string,
    hairColor: string,
    eyeColor: string,
    attrs: any
  ): void {
    const s = this.scale;
    
    // Head - oval shape
    const headGeometry = new THREE.SphereGeometry(0.18 * s, 32, 32);
    headGeometry.scale(1, 1.15, 0.95);
    const headMaterial = this.createMaterial({ color: skinColor, roughness: 0.8 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.5 * s, 0);
    this.setupMesh(head);
    group.add(head);
    
    // Eyes
    this.buildEyes(group, eyeColor, s);
    
    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.02 * s, 0.06 * s, 8);
    const noseMaterial = this.createMaterial({ color: skinColor });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 1.48 * s, 0.16 * s);
    nose.rotation.x = Math.PI / 2;
    group.add(nose);
    
    // Mouth - smile
    const mouthGeometry = new THREE.TorusGeometry(0.05 * s, 0.01 * s, 8, 16, Math.PI);
    const mouthMaterial = this.createMaterial({ color: '#CD5C5C' });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.38 * s, 0.15 * s);
    mouth.rotation.x = Math.PI;
    group.add(mouth);
    
    // Ears
    this.buildEars(group, skinColor, s);
    
    // Hair
    this.buildHair(group, hairColor, s, attrs);
    
    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.08 * s, 0.09 * s, 0.15 * s, 16);
    const neckMaterial = this.createMaterial({ color: skinColor });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 1.28 * s, 0);
    this.setupMesh(neck);
    group.add(neck);
  }
  
  /**
   * Build eyes with pupils
   */
  private buildEyes(group: THREE.Group, eyeColor: string, scale: number): void {
    // Eye whites
    const eyeWhiteGeometry = new THREE.SphereGeometry(0.04 * scale, 16, 16);
    const eyeWhiteMaterial = this.createMaterial({ color: '#ffffff' });
    
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    leftEyeWhite.position.set(-0.08 * scale, 1.55 * scale, 0.15 * scale);
    group.add(leftEyeWhite);
    
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    rightEyeWhite.position.set(0.08 * scale, 1.55 * scale, 0.15 * scale);
    group.add(rightEyeWhite);
    
    // Pupils (iris)
    const pupilGeometry = new THREE.SphereGeometry(0.025 * scale, 16, 16);
    const pupilMaterial = this.createMaterial({ color: eyeColor });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.08 * scale, 1.55 * scale, 0.17 * scale);
    group.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.08 * scale, 1.55 * scale, 0.17 * scale);
    group.add(rightPupil);
    
    // Black pupils (center)
    const blackPupilGeometry = new THREE.SphereGeometry(0.015 * scale, 12, 12);
    const blackPupilMaterial = this.createMaterial({ color: '#000000' });
    
    const leftBlackPupil = new THREE.Mesh(blackPupilGeometry, blackPupilMaterial);
    leftBlackPupil.position.set(-0.08 * scale, 1.55 * scale, 0.18 * scale);
    group.add(leftBlackPupil);
    
    const rightBlackPupil = new THREE.Mesh(blackPupilGeometry, blackPupilMaterial);
    rightBlackPupil.position.set(0.08 * scale, 1.55 * scale, 0.18 * scale);
    group.add(rightBlackPupil);
  }
  
  /**
   * Build ears
   */
  private buildEars(group: THREE.Group, skinColor: string, scale: number): void {
    const earGeometry = new THREE.SphereGeometry(0.04 * scale, 16, 16);
    earGeometry.scale(0.5, 1, 0.8);
    const earMaterial = this.createMaterial({ color: skinColor });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.18 * scale, 1.5 * scale, 0);
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.18 * scale, 1.5 * scale, 0);
    group.add(rightEar);
  }
  
  /**
   * Build hair with different styles
   */
  private buildHair(group: THREE.Group, hairColor: string, scale: number, attrs: any): void {
    const hairStyle = attrs.hair?.style || 'normal';
    
    let hairGeometry: THREE.BufferGeometry;
    
    switch (hairStyle.toLowerCase()) {
      case 'short':
        hairGeometry = new THREE.SphereGeometry(0.19 * scale, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
        break;
      case 'long':
        hairGeometry = new THREE.SphereGeometry(0.2 * scale, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);
        break;
      case 'curly':
        hairGeometry = new THREE.SphereGeometry(0.22 * scale, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
        break;
      case 'bald':
        return; // No hair
      default:
        hairGeometry = new THREE.SphereGeometry(0.2 * scale, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
    }
    
    const hairMaterial = this.createMaterial({ color: hairColor, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 1.62 * scale, 0);
    this.setupMesh(hair);
    group.add(hair);
  }
  
  /**
   * Build body/torso
   */
  private buildBody(group: THREE.Group, _skinColor: string, clothing: any, attrs: any): void {
    const s = this.scale;
    const subType = attrs.entitySubType || '';
    
    if (clothing.dress) {
      // Dress/skirt
      const dressGeometry = new THREE.CylinderGeometry(0.12 * s, 0.28 * s, 0.75 * s, 16);
      const dressMaterial = this.createMaterial({ color: clothing.dress, roughness: 0.7 });
      const dress = new THREE.Mesh(dressGeometry, dressMaterial);
      dress.position.set(0, 0.85 * s, 0);
      this.setupMesh(dress);
      group.add(dress);
      
      // Feet
      this.buildFeet(group, s);
    } else {
      // Torso with shirt
      const torsoShape = subType.includes('female') ? 'hourglass' : 'straight';
      this.buildTorso(group, clothing.shirt || '#4a90e2', s, torsoShape);
      
      // Pants/legs
      this.buildLegs(group, clothing.pants || '#2c3e50', s);
      
      // Shoes
      this.buildShoes(group, s);
    }
  }
  
  /**
   * Build torso
   */
  private buildTorso(group: THREE.Group, shirtColor: string, scale: number, shape: string): void {
    const torsoGeometry = shape === 'hourglass' 
      ? new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 0.55 * scale, 16)
      : new THREE.CylinderGeometry(0.14 * scale, 0.16 * scale, 0.55 * scale, 16);
      
    const torsoMaterial = this.createMaterial({ color: shirtColor, roughness: 0.8 });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.set(0, 0.95 * scale, 0);
    this.setupMesh(torso);
    group.add(torso);
  }
  
  /**
   * Build legs
   */
  private buildLegs(group: THREE.Group, pantsColor: string, scale: number): void {
    const legMaterial = this.createMaterial({ color: pantsColor });
    
    // Upper legs
    const upperLegGeometry = new THREE.CylinderGeometry(0.08 * scale, 0.07 * scale, 0.35 * scale, 12);
    
    const leftUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
    leftUpperLeg.position.set(-0.1 * scale, 0.5 * scale, 0);
    this.setupMesh(leftUpperLeg);
    group.add(leftUpperLeg);
    
    const rightUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
    rightUpperLeg.position.set(0.1 * scale, 0.5 * scale, 0);
    this.setupMesh(rightUpperLeg);
    group.add(rightUpperLeg);
    
    // Lower legs
    const lowerLegGeometry = new THREE.CylinderGeometry(0.06 * scale, 0.055 * scale, 0.3 * scale, 12);
    
    const leftLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
    leftLowerLeg.position.set(-0.1 * scale, 0.18 * scale, 0);
    this.setupMesh(leftLowerLeg);
    group.add(leftLowerLeg);
    
    const rightLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
    rightLowerLeg.position.set(0.1 * scale, 0.18 * scale, 0);
    this.setupMesh(rightLowerLeg);
    group.add(rightLowerLeg);
  }
  
  /**
   * Build shoes
   */
  private buildShoes(group: THREE.Group, scale: number): void {
    const shoeGeometry = new THREE.BoxGeometry(0.08 * scale, 0.06 * scale, 0.12 * scale);
    const shoeMaterial = this.createMaterial({ color: '#2c2c2c' });
    
    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(-0.1 * scale, 0.03 * scale, 0.02 * scale);
    this.setupMesh(leftShoe);
    group.add(leftShoe);
    
    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    rightShoe.position.set(0.1 * scale, 0.03 * scale, 0.02 * scale);
    this.setupMesh(rightShoe);
    group.add(rightShoe);
  }
  
  /**
   * Build feet (for dresses)
   */
  private buildFeet(group: THREE.Group, scale: number): void {
    const footGeometry = new THREE.SphereGeometry(0.06 * scale, 16, 16);
    footGeometry.scale(1, 0.6, 1.4);
    const footMaterial = this.createMaterial({ color: '#8B4513' });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.1 * scale, 0.05 * scale, 0.05 * scale);
    this.setupMesh(leftFoot);
    group.add(leftFoot);
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.1 * scale, 0.05 * scale, 0.05 * scale);
    this.setupMesh(rightFoot);
    group.add(rightFoot);
  }
  
  /**
   * Build arms and hands
   */
  private buildLimbs(group: THREE.Group, skinColor: string, clothing: any, _attrs: any): void {
    const s = this.scale;
    const shirtColor = clothing.shirt || clothing.dress || '#4a90e2';
    
    // Upper arms (shirt color)
    const upperArmGeometry = new THREE.CylinderGeometry(0.05 * s, 0.045 * s, 0.3 * s, 12);
    const upperArmMaterial = this.createMaterial({ color: shirtColor });
    
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    leftUpperArm.position.set(-0.24 * s, 1.05 * s, 0);
    this.setupMesh(leftUpperArm);
    group.add(leftUpperArm);
    
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    rightUpperArm.position.set(0.24 * s, 1.05 * s, 0);
    this.setupMesh(rightUpperArm);
    group.add(rightUpperArm);
    
    // Forearms (skin color)
    const forearmGeometry = new THREE.CylinderGeometry(0.04 * s, 0.035 * s, 0.25 * s, 12);
    const forearmMaterial = this.createMaterial({ color: skinColor });
    
    const leftForearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    leftForearm.position.set(-0.24 * s, 0.78 * s, 0);
    this.setupMesh(leftForearm);
    group.add(leftForearm);
    
    const rightForearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    rightForearm.position.set(0.24 * s, 0.78 * s, 0);
    this.setupMesh(rightForearm);
    group.add(rightForearm);
    
    // Hands
    const handGeometry = new THREE.SphereGeometry(0.045 * s, 12, 12);
    handGeometry.scale(0.8, 1, 0.6);
    const handMaterial = this.createMaterial({ color: skinColor });
    
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.24 * s, 0.62 * s, 0);
    this.setupMesh(leftHand);
    group.add(leftHand);
    
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.24 * s, 0.62 * s, 0);
    this.setupMesh(rightHand);
    group.add(rightHand);
  }
}

