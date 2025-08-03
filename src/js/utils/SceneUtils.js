/**
 * Scene Utilities - Reusable functions for building chart components
 * Extracted from Scene 1 Medieval for future reuse across scenes
 */

import { ColorPalette } from './ColorPalette.js';

export class SceneUtils {
    
    /**
     * Create main chart axes with consistent styling
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {number} width - Chart width
     * @param {number} height - Chart height
     * @param {number} chartHeight - Height for the main chart area
     * @param {Object} xScale - D3 scale for X-axis
     * @param {Object} yScale - D3 scale for Y-axis
     * @param {boolean} isPrimaryPopulation - Whether showing population or GDP data
     * @param {number} animationDuration - Animation duration in ms
     */
    static createMainAxes(sceneGroup, width, height, chartHeight, xScale, yScale, isPrimaryPopulation, animationDuration) {
        // X-axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('d'))
            .tickSize(-chartHeight)
            .tickPadding(8);
        
        sceneGroup.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .call(xAxis)
            .transition()
            .delay(animationDuration)
            .duration(500)
            .style('opacity', 1);
        
        // Y-axis
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d => isPrimaryPopulation ? 
                d3.format(',')(d) + 'k' : 
                '£' + d3.format('.0f')(d) + 'M'
            )
            .tickSize(-width)
            .tickPadding(8);
        
        sceneGroup.append('g')
            .attr('class', 'axis y-axis')
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .call(yAxis)
            .transition()
            .delay(animationDuration + 200)
            .duration(500)
            .style('opacity', 1);
        
        // Axis labels
        sceneGroup.append('text')
            .attr('class', 'axis-label x-label')
            .attr('x', width / 2)
            .attr('y', chartHeight + 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .text('Year')
            .transition()
            .delay(animationDuration + 400)
            .duration(500)
            .style('opacity', 1);
        
        sceneGroup.append('text')
            .attr('class', 'axis-label y-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -chartHeight / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .text(isPrimaryPopulation ? 'Population (thousands)' : 'GDP (millions, 2013 prices)')
            .transition()
            .delay(animationDuration + 600)
            .duration(500)
            .style('opacity', 1);
    }
    
    /**
     * Create main trend line with data points
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {Array} data - Data array
     * @param {Object} xScale - D3 scale for X-axis
     * @param {Object} yScale - D3 scale for Y-axis
     * @param {boolean} isPrimaryPopulation - Whether showing population or GDP data
     * @param {number} animationDuration - Animation duration in ms
     */
    static createMainTrendLine(sceneGroup, data, xScale, yScale, isPrimaryPopulation, animationDuration) {
        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Add trend line
        sceneGroup.append('path')
            .datum(data)
            .attr('class', 'main-trend-line')
            .attr('fill', 'none')
            .attr('stroke', isPrimaryPopulation ? '#e91e63' : '#1976d2')
            .attr('stroke-width', 3)
            .attr('d', line)
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .transition()
            .delay(animationDuration * 2)
            .duration(1000)
            .style('opacity', 1);
        
        // Add data points
        sceneGroup.selectAll('.data-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.value))
            .attr('r', 0)
            .attr('fill', isPrimaryPopulation ? '#e91e63' : '#1976d2')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('opacity', animationDuration > 0 ? 0 : 1)
            .transition()
            .delay((d, i) => animationDuration * 2 + i * 50)
            .duration(300)
            .attr('r', 4)
            .style('opacity', 1);
    }
    
    /**
     * Create historical event markers
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {Array} events - Array of historical events
     * @param {Object} xScale - D3 scale for X-axis
     * @param {number} height - Chart height
     * @param {number} animationDuration - Animation duration in ms
     * @param {Function} onEventHover - Callback for event hover
     * @param {Function} onEventClick - Callback for event click
     */
    static createEventMarkers(sceneGroup, events, xScale, height, animationDuration, onEventHover, onEventClick) {
        events.forEach((event, i) => {
            const x = xScale(event.year);
            const baseY = 140;
            const yOffset = (i % 2 === 0) ? 0 : 60;
            const y = baseY + yOffset;
            const markerColor = ColorPalette.getEventColor(i);
            
            // Add vertical line
            sceneGroup.append('line')
                .attr('class', 'event-line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x)
                .attr('y2', height - 95)
                .attr('stroke', markerColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .style('opacity', animationDuration > 0 ? 0 : 1)
                .transition()
                .delay(animationDuration * 3 + i * 300)
                .duration(500)
                .style('opacity', 0.6);
            
            // Add event circle
            const eventCircle = sceneGroup.append('circle')
                .attr('class', 'event-marker')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 0)
                .attr('fill', markerColor)
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('opacity', animationDuration > 0 ? 0 : 1)
                .style('filter', `drop-shadow(0 0 4px ${markerColor})`)
                .on('mouseover', (e) => {
                    onEventHover(e, event, markerColor);
                    eventCircle.transition().duration(200).attr('r', 8);
                })
                .on('mouseout', () => {
                    onEventHover(null, null, null);
                    eventCircle.transition().duration(200).attr('r', 6);
                })
                .on('click', (e) => onEventClick(event, markerColor));
            
            eventCircle.transition()
                .delay(animationDuration * 3 + i * 300)
                .duration(500)
                .attr('r', 6)
                .style('opacity', 1);
            
            // Add event label
            SceneUtils.createEventLabel(sceneGroup, event, x, y, markerColor, animationDuration, i);
        });
    }
    
    /**
     * Create event label with background
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {Object} event - Event data
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Label color
     * @param {number} animationDuration - Animation duration in ms
     * @param {number} index - Event index
     */
    static createEventLabel(sceneGroup, event, x, y, color, animationDuration, index) {
        const labelGroup = sceneGroup.append('g')
            .attr('class', 'event-label-group')
            .style('opacity', animationDuration > 0 ? 0 : 1);
        
        const labelText = `${event.year} - ${event.event}`;
        const labelWidth = labelText.length * 6;
        const labelHeight = 16;
        
        // Background rectangle
        labelGroup.append('rect')
            .attr('x', x + 8)
            .attr('y', y - 22)
            .attr('width', labelWidth + 8)
            .attr('height', labelHeight)
            .attr('fill', 'rgba(255, 255, 255, 0.9)')
            .attr('stroke', color)
            .attr('stroke-width', 1)
            .attr('rx', 3);
        
        // Text label
        labelGroup.append('text')
            .attr('class', 'event-label')
            .attr('x', x + 12)
            .attr('y', y - 10)
            .attr('text-anchor', 'start')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', color)
            .text(labelText);
        
        labelGroup.transition()
            .delay(animationDuration * 3 + index * 300 + 200)
            .duration(500)
            .style('opacity', 1);
    }
    
    /**
     * Create scene title
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {number} width - Chart width
     * @param {string} title - Title text
     * @param {string} subtitle - Subtitle text
     */
    static createSceneTitle(sceneGroup, width, title, subtitle) {
        // Main title
        sceneGroup.append('text')
            .attr('class', 'scene-title')
            .attr('x', width / 2)
            .attr('y', -70)
            .attr('text-anchor', 'middle')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .style('fill', '#1f4e79')
            .style('opacity', 0)
            .text(title)
            .transition()
            .duration(500)
            .style('opacity', 1);
        
        // Subtitle
        sceneGroup.append('text')
            .attr('class', 'scene-subtitle')
            .attr('x', width / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('fill', '#666')
            .style('opacity', 0)
            .text(subtitle)
            .transition()
            .delay(200)
            .duration(500)
            .style('opacity', 1);
    }
    
    /**
     * Create tooltip
     * @param {Object} event - Mouse event
     * @param {Object} data - Tooltip data
     * @param {string} color - Tooltip color theme
     * @param {string} type - Tooltip type ('event' or 'story')
     */
    static createTooltip(event, data, color, type = 'event') {
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        
        if (type === 'event') {
            return SceneUtils.createEventTooltip(tooltip, event, data, color);
        } else if (type === 'story') {
            return SceneUtils.createEventStoryTooltip(tooltip, data, color);
        }
    }
    
    /**
     * Create event tooltip
     * @param {Object} tooltip - D3 tooltip selection
     * @param {Object} event - Mouse event
     * @param {Object} data - Event data
     * @param {string} color - Tooltip color
     */
    static createEventTooltip(tooltip, event, data, color) {
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', `2px solid ${color}`)
            .style('max-width', '250px')
            .style('line-height', '1.4');
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 6px; color: ${color};">${data.year} - ${data.event}</div>`;
        tooltipContent += `<div style="border-bottom: 1px solid ${color}; margin-bottom: 8px; padding-bottom: 4px;"></div>`;
        tooltipContent += `<div style="margin-bottom: 8px; font-size: 12px;">${data.story}</div>`;
        tooltipContent += `<div style="font-size: 11px; font-style: italic; opacity: 0.9;">Impact: ${data.economicEffect}</div>`;
        tooltipContent += `<div style="text-align: center; margin-top: 6px; font-size: 10px; opacity: 0.8;">Click event marker for full story</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 270) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    /**
     * Create event story tooltip
     * @param {Object} tooltip - D3 tooltip selection
     * @param {Object} data - Event data
     * @param {string} color - Tooltip color
     */
    static createEventStoryTooltip(tooltip, data, color) {
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.95)')
            .style('color', 'white')
            .style('padding', '15px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 8px 25px rgba(0,0,0,0.5)')
            .style('border', `2px solid ${color}`)
            .style('max-width', '400px')
            .style('line-height', '1.6');
        
        let storyContent = `<div style="border-bottom: 2px solid ${color}; margin-bottom: 12px; padding-bottom: 8px;">`;
        storyContent += `<strong style="color: ${color}; font-size: 16px;">${data.year} - ${data.event}</strong></div>`;
        storyContent += `<div style="margin-bottom: 12px; font-size: 14px;">${data.story}</div>`;
        storyContent += `<div style="margin-bottom: 12px; font-size: 14px;">${data.story2}</div>`;
        storyContent += `<div style="background: rgba(255,193,7,0.2); padding: 8px; border-radius: 4px; margin-bottom: 12px;">`;
        storyContent += `<strong style="color: #FFC107;">Economic Impact:</strong><br/>`;
        storyContent += `<small>${data.economicEffect}</small></div>`;
        storyContent += `<div style="background: rgba(76,175,80,0.2); padding: 8px; border-radius: 4px; margin-bottom: 12px;">`;
        storyContent += `<strong style="color: #4CAF50;">Long-term Impact:</strong><br/>`;
        storyContent += `<small>${data.longTermImpact}</small></div>`;
        
        tooltip.html(storyContent)
            .style('left', Math.min(window.innerWidth / 2 - 200, window.innerWidth - 420) + 'px')
            .style('top', Math.max(window.innerHeight / 2 - 150, 20) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(300)
            .style('opacity', 1);
    }
    
    /**
     * Hide tooltip
     */
    static hideTooltip() {
        d3.selectAll('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }
} 