/**
 * Position System - Utilities for positioning and spatial calculations
 */

import type { PositionDefinition, RelationshipDefinition } from '../../core/types';

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  position: Point3D;
  rotation: number;
  scale: number;
}

export class PositionSystem {
  /**
   * Calculate distance between two points
   */
  static distance2D(point1: Point2D, point2: Point2D): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate distance between two 3D points
   */
  static distance3D(point1: Point3D, point2: Point3D): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculate angle between two points
   */
  static angle(point1: Point2D, point2: Point2D): number {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  }

  /**
   * Rotate a point around another point
   */
  static rotatePoint(point: Point2D, center: Point2D, angle: number): Point2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos,
    };
  }

  /**
   * Scale a point from a center point
   */
  static scalePoint(point: Point2D, center: Point2D, scale: number): Point2D {
    return {
      x: center.x + (point.x - center.x) * scale,
      y: center.y + (point.y - center.y) * scale,
    };
  }

  /**
   * Check if a point is inside a bounding box
   */
  static isPointInBounds(point: Point2D, bounds: BoundingBox): boolean {
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  /**
   * Check if two bounding boxes intersect
   */
  static boundsIntersect(bounds1: BoundingBox, bounds2: BoundingBox): boolean {
    return !(
      bounds1.x + bounds1.width < bounds2.x ||
      bounds2.x + bounds2.width < bounds1.x ||
      bounds1.y + bounds1.height < bounds2.y ||
      bounds2.y + bounds2.height < bounds1.y
    );
  }

  /**
   * Calculate position based on relationship
   */
  static calculateRelativePosition(
    basePosition: PositionDefinition,
    relationship: RelationshipDefinition,
    entitySize: { width: number; height: number } = { width: 50, height: 50 }
  ): PositionDefinition {
    const distance = relationship.distance || 100;
    let offsetX = 0;
    let offsetY = 0;

    switch (relationship.type) {
      case 'left': {
        offsetX = -distance - entitySize.width;
        break;
      }
      case 'right': {
        offsetX = distance + entitySize.width;
        break;
      }
      case 'behind': {
        offsetY = distance + entitySize.height;
        break;
      }
      case 'in-front': {
        offsetY = -distance - entitySize.height;
        break;
      }
      case 'near': {
        // Random position within distance
        const angle = Math.random() * 2 * Math.PI;
        offsetX = Math.cos(angle) * distance;
        offsetY = Math.sin(angle) * distance;
        break;
      }
      case 'far': {
        // Random position beyond distance
        const farAngle = Math.random() * 2 * Math.PI;
        const farDistance = distance * 2;
        offsetX = Math.cos(farAngle) * farDistance;
        offsetY = Math.sin(farAngle) * farDistance;
        break;
      }
    }

    return {
      x: basePosition.x + offsetX,
      y: basePosition.y + offsetY,
      z: basePosition.z || 0,
      rotation: basePosition.rotation || 0,
      scale: basePosition.scale || 1,
    };
  }

  /**
   * Normalize position to canvas bounds
   */
  static normalizePosition(
    position: PositionDefinition,
    canvasWidth: number,
    canvasHeight: number
  ): PositionDefinition {
    return {
      x: Math.max(0, Math.min(canvasWidth, position.x)),
      y: Math.max(0, Math.min(canvasHeight, position.y)),
      z: position.z || 0,
      rotation: position.rotation || 0,
      scale: position.scale || 1,
    };
  }

  /**
   * Convert relative position (0-1) to absolute position
   */
  static relativeToAbsolute(
    relativePosition: Point2D,
    canvasWidth: number,
    canvasHeight: number
  ): Point2D {
    return {
      x: relativePosition.x * canvasWidth,
      y: relativePosition.y * canvasHeight,
    };
  }

  /**
   * Convert absolute position to relative position (0-1)
   */
  static absoluteToRelative(
    absolutePosition: Point2D,
    canvasWidth: number,
    canvasHeight: number
  ): Point2D {
    return {
      x: absolutePosition.x / canvasWidth,
      y: absolutePosition.y / canvasHeight,
    };
  }

  /**
   * Generate grid positions
   */
  static generateGrid(
    bounds: BoundingBox,
    rows: number,
    cols: number,
    spacing: number = 10
  ): Point2D[] {
    const positions: Point2D[] = [];
    const cellWidth = (bounds.width - spacing * (cols - 1)) / cols;
    const cellHeight = (bounds.height - spacing * (rows - 1)) / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: bounds.x + col * (cellWidth + spacing) + cellWidth / 2,
          y: bounds.y + row * (cellHeight + spacing) + cellHeight / 2,
        });
      }
    }

    return positions;
  }

  /**
   * Generate random positions within bounds
   */
  static generateRandomPositions(
    bounds: BoundingBox,
    count: number,
    minDistance: number = 50
  ): Point2D[] {
    const positions: Point2D[] = [];
    const maxAttempts = count * 10;
    let attempts = 0;

    while (positions.length < count && attempts < maxAttempts) {
      const candidate = {
        x: bounds.x + Math.random() * bounds.width,
        y: bounds.y + Math.random() * bounds.height,
      };

      let validPosition = true;
      for (const existing of positions) {
        if (this.distance2D(candidate, existing) < minDistance) {
          validPosition = false;
          break;
        }
      }

      if (validPosition) {
        positions.push(candidate);
      }

      attempts++;
    }

    return positions;
  }

  /**
   * Apply transform to position
   */
  static applyTransform(position: Point2D, transform: Transform): Point2D {
    // Apply scale
    let result = this.scalePoint(position, transform.position, transform.scale);
    
    // Apply rotation
    result = this.rotatePoint(result, transform.position, transform.rotation);
    
    // Apply translation
    result.x += transform.position.x;
    result.y += transform.position.y;

    return result;
  }
}