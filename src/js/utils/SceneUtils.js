/**
 * Scene Utilities - Reusable functions for building chart components
 * Extracted from Scene 1 Medieval for future reuse across scenes
 */

import { ColorPalette } from './ColorPalette.js';

/**
 * Layout configuration for consistent positioning across scenes
 */
export const LayoutConfig = {
    // Chart positioning
    mainChartHeight: 0.65, // 65% of total height for main chart
    economicStructureHeight: 0.15, // 15% of total height for economic structure
    legendHeight: 0.05, // 5% of total height for legend
    spacing: 0.15, // 15% of total height for spacing between elements
    
    // Economic structure positioning
    economicStructureY: 0.75, // 75% down from top
    legendY: 0.92, // 92% down from top
    
    // Event marker positioning
    eventMarkerBaseY: 0.18, // 18% down from top
    eventMarkerOffset: 0.08, // 8% offset for alternating markers
    
    // Chart margins
    chartMargin: { top: 0.05, right: 0.02, bottom: 0.1, left: 0.08 }
};

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
            .attr('y', -70)
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
     * @param {Function} onDataPointHover - Callback for data point hover
     * @param {Function} onDataPointClick - Callback for data point click
     */
    static createMainTrendLine(sceneGroup, data, xScale, yScale, isPrimaryPopulation, animationDuration, onDataPointHover, onDataPointClick) {
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
            .delay(animationDuration > 0 ? animationDuration : 0)
            .duration(animationDuration > 0 ? 500 : 0)
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
            .on('mouseover', function(event, d) {
                if (onDataPointHover) {
                    onDataPointHover(event, d, isPrimaryPopulation);
                }
                d3.select(this).transition().duration(200).attr('r', 6);
            })
            .on('mouseout', function() {
                if (onDataPointHover) {
                    onDataPointHover(null, null, null);
                }
                d3.select(this).transition().duration(200).attr('r', 4);
            })
            .on('click', function(event, d) {
                if (onDataPointClick) {
                    onDataPointClick(event, d, isPrimaryPopulation);
                }
            })
            .transition()
            .delay((d, i) => animationDuration > 0 ? animationDuration + i * 25 : 0)
            .duration(animationDuration > 0 ? 150 : 0)
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
            
            // Add vertical line - go to X-axis, not all the way down
            sceneGroup.append('line')
                .attr('class', 'event-line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x)
                .attr('y2', height * 0.6) // Go to X-axis level, not bottom
                .attr('stroke', markerColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .style('opacity', animationDuration > 0 ? 0 : 1)
                .transition()
                .delay(animationDuration > 0 ? animationDuration * 1.5 + i * 150 : 0)
                .duration(animationDuration > 0 ? 250 : 0)
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
                .delay(animationDuration > 0 ? animationDuration * 1.5 + i * 150 : 0)
                .duration(animationDuration > 0 ? 250 : 0)
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
            .delay(animationDuration > 0 ? animationDuration * 1.5 + index * 150 + 100 : 0)
            .duration(animationDuration > 0 ? 250 : 0)
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
    
    /**
     * Calculate economic structure positioning based on total height
     * @param {number} totalHeight - Total SVG height
     * @returns {Object} Positioning object with breakdownY and legendY
     */
    static calculateEconomicStructurePosition(totalHeight) {
        return {
            breakdownY: Math.round(totalHeight * LayoutConfig.economicStructureY),
            legendY: Math.round(totalHeight * LayoutConfig.legendY),
            fluidHeight: Math.round(totalHeight * LayoutConfig.economicStructureHeight * 0.8)
        };
    }
    
    /**
     * Calculate main chart height based on total height
     * @param {number} totalHeight - Total SVG height
     * @returns {number} Main chart height
     */
    static calculateMainChartHeight(totalHeight) {
        return Math.round(totalHeight * LayoutConfig.mainChartHeight);
    }
    
    /**
     * Calculate event marker positioning based on total height
     * @param {number} totalHeight - Total SVG height
     * @param {number} index - Event index for alternating positioning
     * @returns {Object} Positioning object with baseY and y
     */
    static calculateEventMarkerPosition(totalHeight, index) {
        const baseY = Math.round(totalHeight * LayoutConfig.eventMarkerBaseY);
        const yOffset = (index % 2 === 0) ? 0 : Math.round(totalHeight * LayoutConfig.eventMarkerOffset);
        return {
            baseY: baseY,
            y: baseY + yOffset
        };
    }
    
    /**
     * Create economic structure visualization
     * @param {Object} sceneGroup - D3 selection for the scene group
     * @param {number} width - Chart width
     * @param {number} height - Chart height
     * @param {Object} xScale - D3 scale for X-axis
     * @param {Array} timePoints - Array of time points with industry data
     * @param {number} animationDuration - Animation duration in ms
     * @param {Function} onIndustryHover - Callback for industry hover
     * @param {Function} onIndustryOut - Callback for industry mouse out
     * @param {Function} createLegend - Function to create legend
     */
    static createEconomicStructure(sceneGroup, width, height, xScale, timePoints, animationDuration, onIndustryHover, onIndustryOut, createLegend) {
        // Create a skinny industry breakdown visualization under the main chart
        const breakdownHeight = 80;
        const breakdownY = height - 100;  // Move down by 50 pixels
        
        // Add "Economic Structure" header
        sceneGroup.append('text')
            .attr('x', width / 2)
            .attr('y', breakdownY - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text('Economic Structure');
        
        if (timePoints.length === 0) return;
        
        // Create a single fluid industry visualization - taller and more detailed
        const fluidHeight = 60;
        
        // Create stacked area chart using D3's stack generator
        const stack = d3.stack()
            .keys(['agriculture', 'crafts', 'services']);
        
        const stackedData = stack(timePoints);
        
        // Create area generator
        const area = d3.area()
            .x(d => xScale(d.data.year))
            .y0(d => breakdownY + fluidHeight - (d[0] / 100) * fluidHeight)
            .y1(d => breakdownY + fluidHeight - (d[1] / 100) * fluidHeight)
            .curve(d3.curveBasis);
        
        // Industry group container
        const industryGroup = sceneGroup.append('g')
            .attr('class', 'industry-breakdown');
        
        // Draw each industry layer with colors that match the CSS
        const industryNames = ['agriculture', 'crafts', 'services'];
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Blue, Purple
        const industryFullNames = ['Agriculture', 'Crafts & Trade', 'Services'];
        
        stackedData.forEach((layer, i) => {
            industryGroup.append('path')
                .datum(layer)
                .attr('class', `industry-area ${industryNames[i]}`)
                .attr('fill', industryColors[i])
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .style('opacity', 0)
                .attr('d', area)
                .transition()
                .delay(animationDuration > 0 ? animationDuration + i * 100 : 0)
                .duration(animationDuration > 0 ? 500 : 0)
                .style('opacity', 0.8);
        });
        
        // Add interactive overlay for mouse tracking
        const overlay = industryGroup.append('rect')
            .attr('class', 'industry-overlay')
            .attr('x', 0)
            .attr('y', breakdownY)
            .attr('width', width)
            .attr('height', fluidHeight)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .style('cursor', 'crosshair');
        
        // Add vertical tracking line (initially hidden)
        const trackingLine = industryGroup.append('line')
            .attr('class', 'tracking-line')
            .attr('y1', breakdownY)
            .attr('y2', breakdownY + fluidHeight)
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .style('opacity', 0);
        
        // Mouse interaction handlers
        overlay
            .on('mouseover', () => {
                trackingLine.style('opacity', 0.7);
            })
            .on('mousemove', (event) => {
                const [mouseX] = d3.pointer(event);
                const year = Math.round(xScale.invert(mouseX));
                
                // Update tracking line position
                trackingLine.attr('x1', mouseX).attr('x2', mouseX);
                
                // Find closest data point (more robust than exact match)
                const closestData = timePoints.reduce((closest, current) => {
                    const currentDiff = Math.abs(current.year - year);
                    const closestDiff = Math.abs(closest.year - year);
                    return currentDiff < closestDiff ? current : closest;
                });
                
                // Show comprehensive tooltip with closest year data
                if (onIndustryHover) {
                    onIndustryHover(event, {
                        year: closestData.year,
                        mouseYear: year, // Show what year the mouse is actually over
                        agriculture: closestData.agriculture,
                        crafts: closestData.crafts,
                        services: closestData.services
                    }, industryColors, industryFullNames);
                }
            })
            .on('mouseout', () => {
                trackingLine.style('opacity', 0);
                if (onIndustryOut) {
                    onIndustryOut();
                }
            });
        
        // Add legend
        if (createLegend) {
            createLegend(breakdownY + fluidHeight + 15);
        }
    }
} 