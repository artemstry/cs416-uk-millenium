/**
 * Shared Color Palette for Historical Events
 * Provides consistent vibrant colors across all scenes
 */

export class ColorPalette {
    static vibrantColors = [
        '#FF6B6B', // Coral Red
        '#4ECDC4', // Turquoise
        '#45B7D1', // Sky Blue
        '#96CEB4', // Mint Green
        '#FFEAA7', // Golden Yellow
        '#DDA0DD', // Plum
        '#98D8C8', // Seafoam
        '#F7DC6F', // Bright Yellow
        '#BB8FCE', // Lavender
        '#85C1E9'  // Light Blue
    ];

    /**
     * Get vibrant color for historical event by index
     * @param {number} eventIndex - Index of the event (0-9)
     * @returns {string} Hex color code
     */
    static getEventColor(eventIndex) {
        return this.vibrantColors[eventIndex % this.vibrantColors.length];
    }

    /**
     * Get all vibrant colors
     * @returns {Array} Array of hex color codes
     */
    static getAllColors() {
        return [...this.vibrantColors];
    }

    /**
     * Get color name for a given index
     * @param {number} eventIndex - Index of the event
     * @returns {string} Color name
     */
    static getColorName(eventIndex) {
        const colorNames = [
            'Coral Red',
            'Turquoise',
            'Sky Blue',
            'Mint Green',
            'Golden Yellow',
            'Plum',
            'Seafoam',
            'Bright Yellow',
            'Lavender',
            'Light Blue'
        ];
        return colorNames[eventIndex % colorNames.length];
    }
} 