// src/engine/entities/builders/ObjectBuilder.ts
/**
 * Object Entity Builder
 * Creates various objects like furniture, trees, buildings, etc.
 */

import * as THREE from 'three';
import { EntityBuilder } from '../base/EntityBase';
import type { EntityDefinition } from '../../core/types';

export class ObjectBuilder extends EntityBuilder {
  getType(): string {
    return 'object';
  }
  
  getSubTypes(): string[] {
    return [
      'tree', 'house', 'car', 'building', 'boat',
      'chair', 'desk', 'table', 'blackboard',
      'bed', 'lamp', 'door', 'window', 'box'
    ];
  }
  
  build(definition: EntityDefinition): THREE.Group {
    const attrs = definition.attributes as any;
    const group = new THREE.Group();
    
    this.scale = this.calculateScale(definition);
    const subType = attrs.entitySubType || 'box';
    
    // Build based on subtype
    switch (subType.toLowerCase()) {
      case 'tree':
        this.buildTree(group, attrs);
        break;
      case 'car':
        this.buildCar(group, attrs);
        break;
      case 'house':
        this.buildHouse(group, attrs);
        break;
      case 'chair':
        this.buildChair(group, attrs);
        break;
      case 'desk':
      case 'table':
        this.buildTable(group, attrs);
        break;
      case 'blackboard':
        this.buildBlackboard(group, attrs);
        break;
      default:
        this.buildGenericBox(group, attrs);
    }
    
    this.positionEntity(group, definition);
    return group;
  }
  
  private buildTree(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1 * s, 0.15 * s, 1.0 * s, 8);
    const trunkMaterial = this.createMaterial({ color: '#8B4513', roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(0, 0.5 * s, 0);
    this.setupMesh(trunk);
    group.add(trunk);
    
    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(0.6 * s, 16, 16);
    const foliageMaterial = this.createMaterial({ color: attrs.color || '#228B22', roughness: 0.9 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(0, 1.3 * s, 0);
    this.setupMesh(foliage);
    group.add(foliage);
  }
  
  private buildCar(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    const carColor = attrs.color || '#FF0000';
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8 * s, 0.3 * s, 0.4 * s);
    const bodyMaterial = this.createMaterial({ color: carColor, metalness: 0.6 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.2 * s, 0);
    this.setupMesh(body);
    group.add(body);
    
    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(0.4 * s, 0.25 * s, 0.38 * s);
    const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    cabin.position.set(-0.1 * s, 0.475 * s, 0);
    this.setupMesh(cabin);
    group.add(cabin);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.12 * s, 0.12 * s, 0.08 * s, 16);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = this.createMaterial({ color: '#333333' });
    
    const positions = [
      [-0.3 * s, 0.1 * s, 0.25 * s],
      [-0.3 * s, 0.1 * s, -0.25 * s],
      [0.3 * s, 0.1 * s, 0.25 * s],
      [0.3 * s, 0.1 * s, -0.25 * s]
    ];
    
    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(wheel);
      group.add(wheel);
    });
  }
  
  private buildHouse(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    
    // Walls
    const wallsGeometry = new THREE.BoxGeometry(1.5 * s, 1.2 * s, 1.2 * s);
    const wallsMaterial = this.createMaterial({ color: attrs.color || '#D2691E' });
    const walls = new THREE.Mesh(wallsGeometry, wallsMaterial);
    walls.position.set(0, 0.6 * s, 0);
    this.setupMesh(walls);
    group.add(walls);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.0 * s, 0.6 * s, 4);
    roofGeometry.rotateY(Math.PI / 4);
    const roofMaterial = this.createMaterial({ color: '#8B0000' });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1.5 * s, 0);
    this.setupMesh(roof);
    group.add(roof);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(0.3 * s, 0.6 * s, 0.05 * s);
    const doorMaterial = this.createMaterial({ color: '#654321' });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.3 * s, 0.625 * s);
    this.setupMesh(door);
    group.add(door);
  }
  
  private buildChair(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    const chairColor = attrs.color || '#8B4513';
    const material = this.createMaterial({ color: chairColor });
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.4 * s, 0.05 * s, 0.4 * s);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(0, 0.4 * s, 0);
    this.setupMesh(seat);
    group.add(seat);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(0.4 * s, 0.5 * s, 0.05 * s);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(0, 0.65 * s, -0.175 * s);
    this.setupMesh(back);
    group.add(back);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.03 * s, 0.03 * s, 0.4 * s, 8);
    const positions = [
      [-0.15 * s, 0.2 * s, -0.15 * s],
      [-0.15 * s, 0.2 * s, 0.15 * s],
      [0.15 * s, 0.2 * s, -0.15 * s],
      [0.15 * s, 0.2 * s, 0.15 * s]
    ];
    
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
  }
  
  private buildTable(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    const tableColor = attrs.color || '#8B4513';
    const material = this.createMaterial({ color: tableColor });
    
    // Top
    const topGeometry = new THREE.BoxGeometry(1.2 * s, 0.05 * s, 0.6 * s);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.set(0, 0.7 * s, 0);
    this.setupMesh(top);
    group.add(top);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.04 * s, 0.04 * s, 0.7 * s, 8);
    const positions = [
      [-0.5 * s, 0.35 * s, -0.25 * s],
      [-0.5 * s, 0.35 * s, 0.25 * s],
      [0.5 * s, 0.35 * s, -0.25 * s],
      [0.5 * s, 0.35 * s, 0.25 * s]
    ];
    
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      this.setupMesh(leg);
      group.add(leg);
    });
  }
  
  private buildBlackboard(group: THREE.Group, _attrs: any): void {
    const s = this.scale;
    
    // Board
    const boardGeometry = new THREE.BoxGeometry(1.5 * s, 1.0 * s, 0.05 * s);
    const boardMaterial = this.createMaterial({ color: '#1a1a1a' });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(0, 1.0 * s, 0);
    this.setupMesh(board);
    group.add(board);
    
    // Frame
    const frameMaterial = this.createMaterial({ color: '#8B4513' });
    const frameThickness = 0.03 * s;
    
    // Top frame
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.56 * s, frameThickness, 0.08 * s),
      frameMaterial
    );
    topFrame.position.set(0, 1.515 * s, 0);
    group.add(topFrame);
    
    // Bottom frame
    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.56 * s, frameThickness, 0.08 * s),
      frameMaterial
    );
    bottomFrame.position.set(0, 0.485 * s, 0);
    group.add(bottomFrame);
  }
  
  private buildGenericBox(group: THREE.Group, attrs: any): void {
    const s = this.scale;
    const boxGeometry = new THREE.BoxGeometry(0.5 * s, 0.5 * s, 0.5 * s);
    const boxMaterial = this.createMaterial({ color: attrs.color || '#888888' });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 0.25 * s, 0);
    this.setupMesh(box);
    group.add(box);
  }
}

