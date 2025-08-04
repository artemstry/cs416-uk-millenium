/**
 * Scene 6: Interactive Exploration (All Periods)
 * Allows users to explore the full millennium dataset interactively
 */

import { SceneUtils } from '../utils/SceneUtils.js';

export class Scene6Interactive {
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = 1000;
        
        // All period data combined (with null safety)
        if (!data) {
            console.warn('⚠️ Scene6Interactive: Data not loaded yet, will show loading message');
            this.allData = [];
        } else {
            // Try different data sources to get the full dataset
            if (data.raw) {
                this.allData = data.raw;
            } else if (data.enriched) {
                this.allData = data.enriched;
            } else if (data.periods) {
                this.allData = Object.values(data.periods).flatMap(period => period.data);
            } else {
                console.warn('⚠️ Scene6Interactive: No valid data source found, will show loading message');
                this.allData = [];
            }
        }
        
        // Chart dimensions - same as Scene 1
        this.margin = { top: 120, right: 80, bottom: 120, left: 100 }; // Extra bottom margin for controls
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        // Interactive state (following Scene 1 pattern)
        this.selectedMetric = 'gdpReal';
        this.selectedPeriod = 'all';
        this.showPopulation = true;
        
        // Historical events for positioning
        this.historicalEvents = [
            { year: 1348, event: 'Black Death' },
            { year: 1492, event: 'Age of Discovery' },
            { year: 1694, event: 'Bank of England' },
            { year: 1769, event: 'Industrial Revolution' },
            { year: 1825, event: 'First Steam Railway' },
            { year: 1851, event: 'Great Exhibition' },
            { year: 1914, event: 'World War I' },
            { year: 1929, event: 'Great Depression' },
            { year: 1945, event: 'Post-War Boom' },
            { year: 1986, event: 'Big Bang' }
        ];
        
        console.log(`🔍 Scene 6 Interactive: ${this.allData.length} years of data across all periods`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 6: Interactive Exploration...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-interactive')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render main chart (same pattern as Scene 1)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add industry breakdown visualization
        this.addIndustryBreakdown();
        
        return this;
    }
    
    addSceneTitle() {
        // Main title
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', -80)
            .attr('text-anchor', 'middle')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .style('fill', '#1f4e79')
            .text('Interactive Exploration (1209-2016)');
        
        // Subtitle
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', -55)
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('fill', '#666')
            .text('A Thousand Years of UK Economic History');
    }
    
    renderPopulationChart() {
        console.log('🔍 All periods data available:', this.allData);
        console.log('🔍 Data structure:', this.data);
        
        // Get both population and GDP data where available
        const populationData = this.allData
            .filter(d => (d.population !== null || d.populationEngland !== null) && d.year >= 1270)
            .map(d => ({ 
                year: d.year, 
                value: d.population || d.populationEngland, 
                type: 'population' 
            }));
        
        const gdpData = this.allData
            .filter(d => d.gdpReal !== null)
            .map(d => ({ year: d.year, value: d.gdpReal, type: 'gdp' }));
        
        console.log(`📊 Population: ${populationData.length} points, GDP: ${gdpData.length} points`);
        console.log(`📊 Population data range: ${populationData[0]?.year} to ${populationData[populationData.length-1]?.year}`);
        console.log(`📊 First 5 population points:`, populationData.slice(0, 5));
        console.log(`📊 Sample raw data:`, this.allData.slice(0, 10));
        
        // Check if population data exists in the raw data
        const populationInRaw = this.allData.filter(d => d.population !== null);
        console.log(`📊 Population data in raw: ${populationInRaw.length} points`);
        console.log(`📊 Population data range in raw: ${populationInRaw[0]?.year} to ${populationInRaw[populationInRaw.length-1]?.year}`);
        console.log(`📊 First 10 population points in raw:`, populationInRaw.slice(0, 10));
        
        // Check the actual data structure
        console.log(`📊 Data structure keys:`, Object.keys(this.data));
        console.log(`📊 Raw data length:`, this.data.raw?.length);
        console.log(`📊 Enriched data length:`, this.data.enriched?.length);
        console.log(`📊 Periods keys:`, Object.keys(this.data.periods || {}));
        
        // Check if we're using the right data source
        if (this.data.raw) {
            const rawPopulation = this.data.raw.filter(d => d.population !== null);
            console.log(`📊 Raw population data: ${rawPopulation.length} points`);
            console.log(`📊 Raw population range: ${rawPopulation[0]?.year} to ${rawPopulation[rawPopulation.length-1]?.year}`);
            console.log(`📊 First 5 raw population points:`, rawPopulation.slice(0, 5));
        }
        
        if (populationData.length === 0 && gdpData.length === 0) {
            this.renderStagnationStory();
            return;
        }
        
        // Create the main narrative chart
        this.renderTransformationStory(populationData, gdpData);
    }
    
    renderTransformationStory(populationData, gdpData) {
        console.log('📖 Rendering transformation story...');
        
        // Use GDP as primary for full millennium view (more dramatic)
        const primaryData = gdpData.length > 0 ? gdpData : populationData;
        const isPrimaryPopulation = gdpData.length === 0;
        
        if (primaryData.length === 0) {
            this.renderStagnationStory();
            return;
        }
        
        // Chart setup - reduce height by 10% and add space for economic structure
        const chartHeight = this.height * 0.9; // Reduce by 10%
        
        // Determine actual data range
        const allDataYears = [...populationData.map(d => d.year), ...gdpData.map(d => d.year)];
        const actualStartYear = Math.min(...allDataYears);
        const actualEndYear = Math.max(...allDataYears);
        
        console.log(`📊 Adjusting X-axis: data runs from ${actualStartYear} to ${actualEndYear}`);
        
        // Scales
        this.xScale = d3.scaleLinear()
            .domain([actualStartYear, actualEndYear])
            .range([0, this.width]);
        
        // Y scale - don't force 0 to start, let it be dynamic based on actual data
        const allValues = primaryData.map(d => d.value);
        const minValue = d3.min(allValues);
        const maxValue = d3.max(allValues);
        const valueRange = maxValue - minValue;
        const padding = valueRange * 0.1; // 10% padding
        
        // Use logarithmic scale for GDP (exactly like population)
        this.yScale = d3.scaleLog()
            .domain([d3.min(primaryData, d => d.value), d3.max(primaryData, d => d.value) * 1.1])
            .range([chartHeight, 0])
            .nice();
        
        // Add period background highlights
        this.addPeriodBackgrounds(chartHeight);
        
        // Add axes
        this.addMainAxes(chartHeight, isPrimaryPopulation);
        
        // Render main trend line
        this.renderMainTrendLine(primaryData, isPrimaryPopulation);
        
        // Add interactive story points (key events from all periods)
        this.addInteractiveStoryPoints(isPrimaryPopulation);
        
        // Add dual Y-axes with GDP and Population data
        this.addDualAxisChart(populationData, gdpData);
    }
    
    addPeriodBackgrounds(chartHeight) {
        // Add subtle background colors for different periods
        const periodColors = {
            medieval: '#f8f9fa',
            awakening: '#e3f2fd',
            industrial: '#fff3e0',
            crisis: '#ffebee',
            modern: '#e8f5e8'
        };
        
        Object.entries(this.data.periods).forEach(([key, period]) => {
            const startX = this.xScale(period.start);
            const endX = this.xScale(period.end);
            const width = endX - startX;
            
            this.sceneGroup.append('rect')
                .attr('class', `period-background period-${key}`)
                .attr('x', startX)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', chartHeight)
                .attr('fill', periodColors[key] || '#f0f0f0')
                .attr('opacity', 0.2)
                .style('pointer-events', 'none');
                
            // Add period labels
            this.sceneGroup.append('text')
                .attr('x', startX + width / 2)
                .attr('y', chartHeight - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', '#666')
                .style('opacity', 0.7)
                .text(period.name);
        });
    }
    
    addMainAxes(chartHeight, isPrimaryPopulation) {
        // X-axis
        const xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d3.format('d'))
            .ticks(10);
        
        this.sceneGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis);
        
            
        // Y-axis with logarithmic scale (like population but with K/M formatting)
        const yAxisLabel = isPrimaryPopulation ? 'Population (millions)' : 'Real GDP (£M, log scale)';
        const yAxis = d3.axisLeft(this.yScale)
            .tickFormat(d => {
                if (d >= 1000000) {
                    return d3.format('.1f')(d / 1000000) + 'T'; // Show in trillions
                } else {
                    return d3.format('.0f')(d / 1000) + 'B'; // Show in billions
                }
            })
            .tickValues([2000, 3000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 
                700000, 1000000, 1500000, 2000000]);
        
        this.sceneGroup.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(0, 0)`) // Position Y-axis like population (at the top)
            .call(yAxis);
        
        // Y-axis label
        this.sceneGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -60)
            .attr('x', -chartHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(yAxisLabel);
        
        // X-axis label
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', chartHeight + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Year');
    }
    
    renderMainTrendLine(data, isPrimaryPopulation) {
        // Create line generator
        const line = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => this.yScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Add trend line - gradient color for millennium view
        this.sceneGroup.append('path')
            .datum(data)
            .attr('class', 'trend-line')
            .attr('fill', 'none')
            .attr('stroke', isPrimaryPopulation ? '#2E7D32' : '#1565C0') // Match Scene 1 colors
            .attr('stroke-width', 5) // Thicker lines like Scene 1
            .attr('d', line)
            .style('opacity', 0.8);
        
        // Add data points with enhanced tooltips - match Scene 1 size
        this.sceneGroup.selectAll('.data-point')
            .data(data.filter((d, i) => i % 5 === 0)) // Show every 5th point for clarity
            .enter().append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => this.yScale(d.value))
            .attr('r', 4) // Larger data points like Scene 1
            .attr('fill', isPrimaryPopulation ? '#2E7D32' : '#1565C0') // Match Scene 1 colors
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.showEnhancedTooltip(event, d, isPrimaryPopulation))
            .on('mouseout', () => this.hideTooltip());
    }
    
    addInteractiveStoryPoints(isPrimaryPopulation) {
        // 10 Most Important Historical Events Across the Millennium
        const historicalEvents = [
            {
                year: 1348,
                event: 'Black Death',
                story: 'The Black Death devastated Europe, killing 30-60% of the population and fundamentally altering the economic and social structure of medieval society.',
                story2: 'The plague created severe labor shortages, leading to the end of serfdom and the rise of wage labor. It marked the beginning of the end of the medieval economic system.',
                economicEffect: 'Population fell by 30-40%, labor costs rose dramatically, and the feudal system began to collapse. Wages increased as labor became scarce.',
                longTermImpact: 'The Black Death accelerated the transition from feudalism to capitalism and created the conditions for the Renaissance and early modern economy.'
            },
            {
                year: 1492,
                event: 'Age of Discovery',
                story: 'Christopher Columbus\'s voyage to the Americas opened the Age of Discovery, transforming global trade and creating new economic opportunities.',
                story2: 'The discovery of the New World led to the establishment of global trade networks, the rise of maritime powers, and the beginning of European colonialism.',
                economicEffect: 'New trade routes opened, precious metals flowed into Europe, and the foundations of global capitalism were established.',
                longTermImpact: 'The Age of Discovery created the first truly global economy and set the stage for Britain\'s future maritime and imperial dominance.'
            },
            {
                year: 1694,
                event: 'Bank of England',
                story: 'The founding of the Bank of England marked the beginning of modern central banking and financial innovation.',
                story2: 'The Bank was created to fund William III\'s war with France, but it became the foundation of Britain\'s financial system and global financial leadership.',
                economicEffect: 'Interest rates fell from 10%+ to 3-5%, government borrowing became possible, and financial markets developed rapidly.',
                longTermImpact: 'The Bank of England established London as a global financial center and created the foundation for modern banking and finance.'
            },
            {
                year: 1769,
                event: 'Industrial Revolution',
                story: 'James Watt\'s improved steam engine marked the beginning of the Industrial Revolution, the most significant economic transformation in human history.',
                story2: 'The steam engine powered factories, railways, and ships, creating unprecedented economic growth and transforming society from agricultural to industrial.',
                economicEffect: 'Productivity exploded, GDP grew 20x, and Britain became the world\'s first industrial superpower. Real wages began to rise for the first time in centuries.',
                longTermImpact: 'The Industrial Revolution created the modern world economy and established the pattern of sustained economic growth that continues today.'
            },
            {
                year: 1825,
                event: 'First Steam Railway',
                story: 'The Stockton and Darlington Railway opened, marking the beginning of the railway age and revolutionizing transportation.',
                story2: 'Railways connected markets, reduced transport costs, and accelerated industrialization. They created new industries and transformed urban development.',
                economicEffect: 'Transport costs fell by 90%, markets expanded dramatically, and new industries like steel and coal boomed. Railway manias created investment bubbles.',
                longTermImpact: 'Railways created the modern transport infrastructure and accelerated the Industrial Revolution, making Britain the workshop of the world.'
            },
            {
                year: 1851,
                event: 'Great Exhibition',
                story: 'The Great Exhibition showcased Britain\'s industrial might and marked the peak of Victorian economic confidence.',
                story2: 'The Crystal Palace exhibition displayed Britain\'s technological and industrial leadership to the world, celebrating the success of the Industrial Revolution.',
                economicEffect: 'The exhibition boosted British exports, attracted foreign investment, and demonstrated Britain\'s global economic leadership.',
                longTermImpact: 'The Great Exhibition symbolized Britain\'s position as the world\'s leading industrial power and global economic superpower.'
            },
            {
                year: 1914,
                event: 'World War I',
                story: 'World War I shattered the old economic order and marked the beginning of the modern era of government intervention in the economy.',
                story2: 'The war destroyed the gold standard, led to massive government spending, and created the conditions for the Great Depression and modern economic management.',
                economicEffect: 'Government spending exploded from 10% to 40%+ of GDP, inflation soared, and the international economic order collapsed.',
                longTermImpact: 'World War I ended Britain\'s economic dominance and created the conditions for the modern welfare state and Keynesian economics.'
            },
            {
                year: 1929,
                event: 'Great Depression',
                story: 'The Great Depression was the worst economic crisis in modern history, leading to mass unemployment and economic collapse.',
                story2: 'The depression exposed the failures of laissez-faire economics and led to the development of Keynesian economics and modern economic management.',
                economicEffect: 'Unemployment reached 15%+, GDP fell by 20%, and the gold standard was abandoned. Economic confidence was shattered.',
                longTermImpact: 'The Great Depression led to the modern welfare state, government intervention in the economy, and the Bretton Woods system.'
            },
            {
                year: 1945,
                event: 'Post-War Boom',
                story: 'The post-war period saw unprecedented economic growth and the establishment of the modern welfare state.',
                story2: 'Government intervention, the Bretton Woods system, and technological innovation created the longest period of sustained economic growth in history.',
                economicEffect: 'GDP grew rapidly, unemployment fell to 2%, and living standards improved dramatically. The welfare state was established.',
                longTermImpact: 'The post-war boom created the modern consumer society and established the pattern of government intervention in the economy.'
            },
            {
                year: 1986,
                event: 'Big Bang',
                story: 'The Big Bang deregulation of London\'s financial markets transformed the City of London into a global financial center.',
                story2: 'The abolition of fixed commissions, the end of the separation between brokers and jobbers, and the opening of markets to foreign competition revolutionized British finance.',
                economicEffect: 'Financial services employment doubled, foreign investment poured in, and London became the world\'s leading financial center alongside New York.',
                longTermImpact: 'The Big Bang established London as a global financial hub and made financial services the cornerstone of the British economy.'
            }
        ];
        
        // Filter events that fall within our data range
        const relevantEvents = historicalEvents.filter(event => {
            const domain = this.xScale.domain();
            return event.year >= domain[0] && event.year <= domain[1];
        });
        
        // Create event markers with Scene 6 specific styling (dashed lines go to X-axis)
        const chartHeight = this.height * 0.9; // Match the reduced chart height
        this.createScene6EventMarkers(
            this.sceneGroup,
            relevantEvents,
            this.xScale,
            chartHeight,
            this.animationDuration
        );
    }
    
    addMillenniumSummary() {
        // Add summary statistics at bottom
        const summaryY = this.height - 40;
        
        // Calculate key statistics
        const totalYears = this.allData.length;
        const firstYear = d3.min(this.allData, d => d.year);
        const lastYear = d3.max(this.allData, d => d.year);
        
        // Summary text
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', summaryY)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .style('font-style', 'italic')
            .text(`${totalYears} years of data | ${firstYear}-${lastYear} | From medieval agriculture to digital services`);
    }
    
    getEventColor(eventIndex) {
        // Vibrant color palette for historical events
        const colors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Plum
            '#98D8C8', // Mint
            '#F7DC6F', // Gold
            '#BB8FCE', // Purple
            '#85C1E9'  // Light Blue
        ];
        return colors[eventIndex % colors.length];
    }

    createScene6EventMarkers(sceneGroup, events, xScale, height, animationDuration) {
        events.forEach((event, i) => {
            const x = xScale(event.year);
            const y = this.getEventYPosition(event.year, height);
            const markerColor = this.getEventColor(i);

            // Add vertical line - go all the way to X-axis for Scene 6
            sceneGroup.append('line')
                .attr('class', 'event-line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x)
                .attr('y2', height) // Go all the way to X-axis
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
                    // Show detailed story tooltip immediately on mouseover
                    this.showEventStory(event);
                    eventCircle.transition().duration(200).attr('r', 8);
                })
                .on('mouseout', () => {
                    // Hide tooltip immediately on mouseout
                    this.hideTooltip();
                    eventCircle.transition().duration(200).attr('r', 6);
                });
            
            eventCircle.transition()
                .delay(animationDuration > 0 ? animationDuration * 1.5 + i * 150 : 0)
                .duration(animationDuration > 0 ? 250 : 0)
                .attr('r', 6)
                .style('opacity', 1);
            
            // Add event label
            this.createScene6EventLabel(sceneGroup, event, x, y, markerColor, animationDuration, i);
        });
    }

    createScene6EventLabel(sceneGroup, event, x, y, color, animationDuration, index) {
        const labelGroup = sceneGroup.append('g')
            .attr('class', 'event-label-group')
            .style('opacity', animationDuration > 0 ? 0 : 1);
        
        const labelText = `${event.year} - ${event.event}`;
        const labelWidth = labelText.length * 5.5;
        const labelHeight = 16;
        
        // Background rectangle
        labelGroup.append('rect')
            .attr('x', x + 8)
            .attr('y', y - 22)
            .attr('width', labelWidth)
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

    getEventYPosition(year, height) {
        // Vary the height to prevent overlap - use 3 levels with special handling for overlapping events
        const eventIndex = this.historicalEvents.findIndex(e => e.year === year);
        const level = eventIndex % 3;
        const baseY = height * 0.2; // Start at 20% of chart height
        const levelSpacing = height * 0.25; // 25% spacing between levels
        
        // Move specific overlapping events down by different amounts
        const offsets = {
            1929: 20,
            1940: 20,
            1945: 20,
            1914: 45 // Move 1914 down by 45 pixels
        };
        const additionalOffset = offsets[year] || 0;
        
        return baseY + (level * levelSpacing) + additionalOffset;
        
        return baseY + (level * levelSpacing);
    }
    
    getPopulationForYear(year) {
        const dataPoint = this.allData.find(d => d.year === year);
        return dataPoint ? dataPoint.population : null;
    }
    
    getGDPForYear(year) {
        const dataPoint = this.allData.find(d => d.year === year);
        return dataPoint ? dataPoint.gdpReal : null;
    }
    
    showEventTooltip(event, historicalEvent) {
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 6px 20px rgba(0,0,0,0.4)')
            .style('border', `2px solid ${this.getEventColor(historicalEvent.year % 10)}`)
            .style('max-width', '300px')
            .style('line-height', '1.5');
        
        let tooltipContent = `<div style="border-bottom: 1px solid ${this.getEventColor(historicalEvent.year % 10)}; margin-bottom: 8px; padding-bottom: 6px;">`;
        tooltipContent += `<strong style="color: ${this.getEventColor(historicalEvent.year % 10)}; font-size: 15px;">${historicalEvent.year} - ${historicalEvent.event}</strong></div>`;
        tooltipContent += `<div style="margin-bottom: 8px; font-size: 12px;">${historicalEvent.story}</div>`;
        tooltipContent += `<div style="background: rgba(255,255,255,0.1); padding: 6px; border-radius: 4px; margin-bottom: 6px; font-size: 11px; font-style: italic;">Economic Impact: ${historicalEvent.economicEffect}</div>`;
        tooltipContent += `<div style="text-align: center; margin-top: 8px; font-size: 10px; opacity: 0.8;">Click for detailed story</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 320) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    showEnhancedTooltip(event, d, isPrimaryPopulation) {
        const economicContext = this.getEconomicContext(d.year);
        const indicator = isPrimaryPopulation ? 'Population' : 'GDP';
        
        let tooltipContent = `<div style="border-bottom: 1px solid #444; margin-bottom: 8px; padding-bottom: 6px;">`;
        tooltipContent += `<strong style="color: #d4a574; font-size: 15px;">${d.year} - ${economicContext.period}</strong></div>`;
        
        // Get both population and GDP data for this year
        const populationForYear = this.getPopulationForYear(d.year);
        const gdpForYear = this.getGDPForYear(d.year);
        
        // Always show population
        if (populationForYear) {
            const popMillions = (populationForYear / 1000).toFixed(1);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popMillions}M</div>`;
        } else {
            const estimatedPop = this.estimatePopulation(d.year);
            const popMillions = (estimatedPop / 1000).toFixed(1);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popMillions}M</div>`;
        }
        
        // Always show GDP if available
        if (gdpForYear) {
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP:</strong> £${gdpForYear.toFixed(1)}M (2013 prices)</div>`;
            
            // Calculate proper GDP per capita
            const population = populationForYear || this.estimatePopulation(d.year);
            const gdpPerCapita = (gdpForYear * 1000000) / (population * 1000);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP per capita:</strong> £${gdpPerCapita.toFixed(0)}</div>`;
        } else {
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP:</strong> Not available for this period</div>`;
        }
        
        tooltipContent += `<div style="background: rgba(100,50,0,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #FFB74D;">Economic Structure:</strong><br/>`;
        tooltipContent += `<small>${economicContext.structure}</small></div>`;
        
        tooltipContent += `<div style="background: rgba(0,50,100,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #90CAF9;">Key Industries:</strong><br/>`;
        tooltipContent += `<small>${economicContext.industries}</small></div>`;
        
        tooltipContent += `<div style="background: rgba(50,0,100,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #CE93D8;">Historical Context:</strong><br/>`;
        tooltipContent += `<small>${economicContext.social}</small></div>`;
        
        tooltipContent += `<div style="font-size: 11px; opacity: 0.8; text-align: center;">`;
        tooltipContent += `<em>Navigate to period scenes for detailed analysis</em></div>`;
        
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 6px 20px rgba(0,0,0,0.4)')
            .style('border', '1px solid #333')
            .style('max-width', '320px')
            .style('line-height', '1.5')
            .html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 340) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    estimatePopulation(year) {
        // Rough population estimates for GDP per capita calculations
        if (year < 1500) return 3500;
        if (year < 1750) return 5500;
        if (year < 1900) return 20000;
        if (year < 1950) return 45000;
        return 60000;
    }
    
    getEconomicContext(year) {
        // Determine which period this year falls into and return appropriate context
        if (year <= 1500) {
            return {
                period: 'Medieval Economy',
                structure: 'Agricultural subsistence economy with limited trade and sparse data',
                industries: 'Agriculture (80-90%), Basic crafts (10-15%), Trade (5%)',
                social: 'Feudal society, manorial system, limited monetary exchange, high mortality'
            };
        } else if (year <= 1750) {
            return {
                period: 'Early Modern Growth',
                structure: 'Commercial expansion with overseas trade and early banking',
                industries: 'Agriculture (50-75%), Crafts & trade (20-40%), Services (5-10%)',
                social: 'Rising merchant class, joint-stock companies, colonial expansion'
            };
        } else if (year <= 1900) {
            return {
                period: 'Industrial Revolution',
                structure: 'Steam-powered manufacturing transforming entire economy',
                industries: 'Agriculture (15-50%), Manufacturing (35-70%), Services (15%)',
                social: 'Rapid urbanization, factory system, railway networks, industrial cities'
            };
        } else if (year <= 1950) {
            return {
                period: 'Crisis & State Expansion',
                structure: 'War economies and government intervention reshape capitalism',
                industries: 'Agriculture (5-15%), Manufacturing (50-65%), Government (20-45%)',
                social: 'Total war mobilization, welfare state creation, economic planning'
            };
        } else {
            return {
                period: 'Service Economy',
                structure: 'Post-industrial economy dominated by services and technology',
                industries: 'Agriculture (1-5%), Manufacturing (12-45%), Services (50-87%)',
                social: 'Globalization, financial deregulation, digital revolution, Brexit'
            };
        }
    }
    
    addIndustryBreakdown() {
        // Create a skinny industry breakdown visualization under the main chart
        const breakdownHeight = 80;
        const breakdownY = this.height * 0.9 + 100;  // Position below the reduced chart with more space
        
        // Use SceneUtils to create economic structure with proper data
        const timePoints = SceneUtils.prepareEconomicStructureData(
            this.allData,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            10 // interval for millennium view
        );
        
        if (timePoints.length === 0) return;
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([Math.min(...timePoints.map(d => d.year)) - 10, Math.max(...timePoints.map(d => d.year)) + 10])
            .range([0, this.width]);
        
        // Create stacked area chart using D3's stack generator
        const stack = d3.stack()
            .keys(['agriculture', 'crafts', 'services']);
        
        const stackedData = stack(timePoints);
        
        // Create area generator
        const fluidHeight = 100;  // Height for the economic structure
        const area = d3.area()
            .x(d => xScale(d.data.year))
            .y0(d => breakdownY + fluidHeight - (d[0] / 100) * fluidHeight)
            .y1(d => breakdownY + fluidHeight - (d[1] / 100) * fluidHeight)
            .curve(d3.curveBasis);
        
        // Industry group container
        const industryGroup = this.sceneGroup.append('g')
            .attr('class', 'industry-breakdown');
        
        // Draw each industry layer with consistent colors from Scene 1
        const industryNames = ['agriculture', 'crafts', 'services'];
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Steel Blue, Medium Purple
        const industryFullNames = ['Agriculture', 'Manufacturing', 'Services'];
        
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
                .delay(this.animationDuration * 2 + i * 200)
                .duration(1000)
                .style('opacity', 0.8);
        });
        
        // Add interactive overlay for mouse tracking
        const overlay = industryGroup.append('rect')
            .attr('class', 'industry-overlay')
            .attr('x', 0)
            .attr('y', breakdownY)
            .attr('width', this.width)
            .attr('height', fluidHeight)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .style('cursor', 'crosshair');
        
        // Add vertical tracking line (initially hidden)
        const trackingLine = industryGroup.append('line')
            .attr('class', 'tracking-line')
            .attr('x1', 0)
            .attr('y1', breakdownY)
            .attr('x2', 0)
            .attr('y2', breakdownY + fluidHeight)
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .style('opacity', 0);
        
        // Mouse tracking for tooltips
        overlay
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
                this.showIndustryBreakdownTooltip(event, {
                    year: closestData.year,
                    mouseYear: year, // Show what year the mouse is actually over
                    agriculture: closestData.agriculture,
                    manufacturing: closestData.manufacturing,
                    services: closestData.services
                }, industryColors, industryFullNames);
            })
            .on('mouseout', () => {
                trackingLine.style('opacity', 0);
                this.hideTooltip();
            });
        
        // Add legend
        this.addIndustryLegend(breakdownY + fluidHeight + 20);
    }
    
    getIndustryPercentage(year, industry) {
        // Full millennium industry evolution with corrected ratios that always sum to 100%
        if (year <= 1500) {
            switch (industry) {
                case 'agriculture': return 85;
                case 'manufacturing': return 10;
                case 'services': return 5;
            }
        } else if (year <= 1750) {
            const progress = (year - 1500) / 250;
            switch (industry) {
                case 'agriculture': return 85 - (progress * 35); // 85% → 50%
                case 'manufacturing': return 10 + (progress * 30); // 10% → 40%
                case 'services': return 5 + (progress * 5); // 5% → 10%
            }
        } else if (year <= 1900) {
            const progress = (year - 1750) / 150;
            switch (industry) {
                case 'agriculture': return 50 - (progress * 35); // 50% → 15%
                case 'manufacturing': return 40 + (progress * 30); // 40% → 70%
                case 'services': return 10 + (progress * 5); // 10% → 15%
            }
        } else if (year <= 1950) {
            const progress = (year - 1900) / 50;
            switch (industry) {
                case 'agriculture': return 15 - (progress * 10); // 15% → 5%
                case 'manufacturing': return 70 - (progress * 20); // 70% → 50%
                case 'services': return 15 + (progress * 30); // 15% → 45%
            }
        } else {
            const progress = (year - 1950) / 66;
            switch (industry) {
                case 'agriculture': return Math.max(1, 5 - (progress * 4)); // 5% → 1%
                case 'manufacturing': return Math.max(12, 50 - (progress * 38)); // 50% → 12%
                case 'services': return Math.min(87, 45 + (progress * 42)); // 45% → 87%
            }
        }
        return 0;
    }
    
    addIndustryLegend(startY) {
        const industries = [
            { name: 'Agriculture', color: '#8B4513' },
            { name: 'Manufacturing', color: '#4682B4' },
            { name: 'Services', color: '#9370DB' }
        ];
        
        industries.forEach((industry, i) => {
            // Center the legend under the chart
            const legendTotalWidth = (industries.length - 1) * 120; // Space between items
            const legendStartX = (this.width - legendTotalWidth) / 2;
            const x = legendStartX + (i * 120);
            
            // Legend square
            this.sceneGroup.append('rect')
                .attr('x', x)
                .attr('y', startY)
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', industry.color)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5)
                .style('opacity', 0)
                .transition()
                .delay(this.animationDuration * 3 + i * 100)
                .duration(300)
                .style('opacity', 1);
            
            // Legend text
            this.sceneGroup.append('text')
                .attr('x', x + 18)
                .attr('y', startY + 9)
                .style('font-size', '11px')
                .style('fill', '#555')
                .text(industry.name)
                .style('opacity', 0)
                .transition()
                .delay(this.animationDuration * 3 + i * 100)
                .duration(300)
                .style('opacity', 1);
        });
    }
    
    showEventStory(event) {
        const tooltip = d3.select('body').selectAll('.event-story-tooltip')
            .data([0])
            .join('div')
            .attr('class', 'event-story-tooltip tooltip')
            .style('position', 'fixed')
            .style('top', '50%')
            .style('left', '50%')
            .style('transform', 'translate(-50%, -50%)')
            .style('background', 'rgba(10,10,10,0.95)')
            .style('color', 'white')
            .style('padding', '24px')
            .style('border-radius', '12px')
            .style('font-size', '15px')
            .style('z-index', 1002)
            .style('box-shadow', '0 10px 30px rgba(0,0,0,0.5)')
            .style('border', `3px solid ${this.getEventColor(event.year % 10)}`)
            .style('max-width', '600px')
            .style('text-align', 'center');
        
        tooltip.html(`
            <div style="border-bottom: 2px solid ${this.getEventColor(event.year % 10)}; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="color: ${this.getEventColor(event.year % 10)}; margin: 0; font-size: 24px;">${event.year}</h2>
                <h3 style="margin: 4px 0 0 0; color: #d4a574;">${event.event}</h3>
            </div>
            <div style="text-align: left; line-height: 1.6; margin-bottom: 16px;">
                <p>${event.story}</p>
            </div>
            <div style="text-align: left; line-height: 1.6; margin-bottom: 16px;">
                <p>${event.story2}</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: left;">
                <strong style="color: #FFB74D;">Economic Impact:</strong><br/>
                ${event.economicEffect}
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: left;">
                <strong style="color: #4ECDC4;">Long-term Impact:</strong><br/>
                ${event.longTermImpact}
            </div>
        `)
        .style('opacity', 0)
        .transition()
        .duration(400)
        .style('opacity', 1);
        
        d3.select('body').on('keydown.event-story', (e) => {
            if (e.key === 'Escape') {
                tooltip.remove();
                d3.select('body').on('keydown.event-story', null);
            }
        });
    }
    
    showIndustryBreakdownTooltip(event, data, colors, names) {
        const tooltip = d3.select('body').selectAll('.industry-breakdown-tooltip')
            .data([0])
            .join('div')
            .attr('class', 'industry-breakdown-tooltip tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', '1px solid #333')
            .style('min-width', '200px');
        
        const displayYear = data.mouseYear || data.year;
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; color: #d4a574;">Economic Structure - ${displayYear}</div>`;
        
        // Show data source year if different from mouse year
        if (data.mouseYear && data.mouseYear !== data.year) {
            tooltipContent += `<div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #ccc;">Data from ${data.year}</div>`;
        }
        
        // Add each industry with its color and percentage
        tooltipContent += `<div style="margin-bottom: 4px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[0]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[0]}:</strong> ${data.agriculture.toFixed(1)}%</div>`;
        
        tooltipContent += `<div style="margin-bottom: 4px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[1]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[1]}:</strong> ${data.manufacturing.toFixed(1)}%</div>`;
        
        tooltipContent += `<div style="margin-bottom: 8px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[2]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[2]}:</strong> ${data.services.toFixed(1)}%</div>`;
        
        // Add total verification
        const total = data.agriculture + data.manufacturing + data.services;
        tooltipContent += `<div style="border-top: 1px solid #444; padding-top: 4px; font-size: 11px; opacity: 0.8;">`;
        tooltipContent += `Total: ${total.toFixed(1)}%</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 220) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(150)
            .style('opacity', 1);
    }
    
    hideTooltip() {
        d3.select('body').selectAll('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }
    
    renderStagnationStory() {
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#666')
            .text('Loading interactive exploration data...');
    }
    
    renderInteractiveViz() {
        // Filter and prepare data based on current selections
        if (!this.allData || this.allData.length === 0) {
            console.warn('⚠️ No data available for interactive exploration');
            this.sceneGroup.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', '#666')
                .text('Interactive exploration data is being processed...');
            return;
        }

        // Filter data based on selections
        let filteredData = this.allData.filter(d => {
            const hasMetric = d[this.selectedMetric] && !isNaN(d[this.selectedMetric]);
            const hasPopulation = d.population && !isNaN(d.population);
            return hasMetric && (this.showPopulation ? hasPopulation : true);
        });

        if (this.selectedPeriod !== 'all') {
            const period = this.data.periods[this.selectedPeriod];
            filteredData = filteredData.filter(d => d.year >= period.start && d.year <= period.end);
        }

        if (filteredData.length === 0) {
            this.sceneGroup.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', '#666')
                .text('No data available for current selection...');
            return;
        }

        // Set up scales for full millennium view
        const minYear = d3.min(filteredData, d => d.year);
        const maxYear = d3.max(filteredData, d => d.year);
        
        this.xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, this.width]);

        // Dynamic Y scales based on selected metric
        const maxMetricValue = d3.max(filteredData, d => d[this.selectedMetric]);
        const maxPopulation = d3.max(filteredData, d => d.population);
        
        this.yScaleLeft = d3.scaleLinear()
            .domain([0, maxPopulation * 1.1])
            .range([this.height, 0]);
            
        this.yScaleRight = d3.scaleLinear()
            .domain([0, maxMetricValue * 1.1])
            .range([this.height, 0]);

        // Add axes
        this.addInteractiveAxes();
        
        // Add main trend lines
        this.addInteractiveTrendLines(filteredData);
        
        // Add period highlights
        this.addPeriodHighlights();
        
        // Add key events across all periods
        this.addKeyEvents();
    }
    
    addInteractiveAxes() {
        // X-axis
        this.sceneGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.xScale).tickFormat(d3.format('d')));
        
        // Left Y-axis (Population) - only if showing population
        if (this.showPopulation) {
            this.sceneGroup.append('g')
                .attr('class', 'y-axis-left')
                .call(d3.axisLeft(this.yScaleLeft))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -60)
                .attr('x', -this.height / 2)
                .attr('text-anchor', 'middle')
                .style('fill', 'steelblue')
                .style('font-size', '12px')
                .text('Population (millions)');
        }
        
        // Right Y-axis (Selected Metric)
        const metricLabel = this.getMetricLabel(this.selectedMetric);
        this.sceneGroup.append('g')
            .attr('class', 'y-axis-right')
            .attr('transform', `translate(${this.width}, 0)`)
            .call(d3.axisRight(this.yScaleRight))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 60)
            .attr('x', -this.height / 2)
            .attr('text-anchor', 'middle')
            .style('fill', 'darkgreen')
            .style('font-size', '12px')
            .text(metricLabel);
    }
    
    addInteractiveTrendLines(filteredData) {
        // Population line (blue) - if enabled
        if (this.showPopulation) {
            const populationData = filteredData.filter(d => d.population);
            if (populationData.length > 0) {
                const populationLine = d3.line()
                    .x(d => this.xScale(d.year))
                    .y(d => this.yScaleLeft(d.population))
                    .curve(d3.curveMonotoneX);
                
                this.sceneGroup.append('path')
                    .datum(populationData)
                    .attr('class', 'population-line')
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 3)
                    .attr('d', populationLine);
                    
                // Population data points
                this.sceneGroup.selectAll('.population-dot')
                    .data(populationData)
                    .enter().append('circle')
                    .attr('class', 'population-dot')
                    .attr('cx', d => this.xScale(d.year))
                    .attr('cy', d => this.yScaleLeft(d.population))
                    .attr('r', 3)
                    .attr('fill', 'steelblue')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1);
            }
        }
        
        // Selected metric line (green)
        const metricData = filteredData.filter(d => d[this.selectedMetric]);
        if (metricData.length > 0) {
            const metricLine = d3.line()
                .x(d => this.xScale(d.year))
                .y(d => this.yScaleRight(d[this.selectedMetric]))
                .curve(d3.curveMonotoneX);
            
            this.sceneGroup.append('path')
                .datum(metricData)
                .attr('class', 'metric-line')
                .attr('fill', 'none')
                .attr('stroke', 'darkgreen')
                .attr('stroke-width', 3)
                .attr('d', metricLine);
                
            // Metric data points
            this.sceneGroup.selectAll('.metric-dot')
                .data(metricData)
                .enter().append('circle')
                .attr('class', 'metric-dot')
                .attr('cx', d => this.xScale(d.year))
                .attr('cy', d => this.yScaleRight(d[this.selectedMetric]))
                .attr('r', 3)
                .attr('fill', 'darkgreen')
                .attr('stroke', 'white')
                .attr('stroke-width', 1);
        }
    }
    
    addPeriodHighlights() {
        // Add background highlights for different periods
        const periodColors = {
            medieval: '#f8f9fa',
            awakening: '#e3f2fd',
            industrial: '#fff3e0',
            crisis: '#ffebee',
            modern: '#e8f5e8'
        };
        
        Object.entries(this.data.periods).forEach(([key, period]) => {
            const startX = this.xScale(period.start);
            const endX = this.xScale(period.end);
            const width = endX - startX;
            
            this.sceneGroup.append('rect')
                .attr('x', startX)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', this.height)
                .attr('fill', periodColors[key] || '#f0f0f0')
                .attr('opacity', 0.3)
                .style('pointer-events', 'none');
        });
    }
    
    addKeyEvents() {
        // Key events across all periods
        const keyEvents = [
            { year: 1348, event: 'Black Death', period: 'medieval' },
            { year: 1600, event: 'East India Co.', period: 'awakening' },
            { year: 1825, event: 'First Railway', period: 'industrial' },
            { year: 1929, event: 'Great Depression', period: 'crisis' },
            { year: 1990, event: 'World Wide Web', period: 'modern' }
        ];
        
        keyEvents.forEach(event => {
            if (this.xScale && event.year >= this.xScale.domain()[0] && event.year <= this.xScale.domain()[1]) {
                const x = this.xScale(event.year);
                const y = 30;
                
                // Event marker
                this.sceneGroup.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 6)
                    .attr('fill', '#ff6b35')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
                
                // Event label
                this.sceneGroup.append('text')
                    .attr('x', x)
                    .attr('y', y - 12)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .style('font-weight', 'bold')
                    .style('fill', '#333')
                    .text(event.event);
            }
        });
    }
    
    addInteractiveControls() {
        // Add control panel below the chart
        const controlsY = this.height + 60;
        
        // Control panel background
        this.sceneGroup.append('rect')
            .attr('x', 0)
            .attr('y', controlsY - 10)
            .attr('width', this.width)
            .attr('height', 50)
            .attr('fill', '#f8f9fa')
            .attr('stroke', '#dee2e6')
            .attr('rx', 5);
        
        // Controls title
        this.sceneGroup.append('text')
            .attr('x', 20)
            .attr('y', controlsY + 10)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text('Interactive Controls:');
        
        // Metric selector (simplified for demo)
        this.sceneGroup.append('text')
            .attr('x', 20)
            .attr('y', controlsY + 30)
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`Current Metric: ${this.getMetricLabel(this.selectedMetric)}`);
        
        // Period selector
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', controlsY + 30)
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`Period: ${this.selectedPeriod === 'all' ? 'All Periods' : this.data.periods[this.selectedPeriod]?.name}`);
        
        // Population toggle
        this.sceneGroup.append('text')
            .attr('x', this.width - 150)
            .attr('y', controlsY + 30)
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`Population: ${this.showPopulation ? 'Shown' : 'Hidden'}`);
    }
    
    addMillenniumSummary() {
        // Add a summary panel with key statistics
        const summaryY = this.height + 120;
        
        // Calculate key statistics
        const totalYears = this.allData.length;
        const firstYear = d3.min(this.allData, d => d.year);
        const lastYear = d3.max(this.allData, d => d.year);
        
        // Summary title
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', summaryY)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('fill', '#1f4e79')
            .text('Millennium at a Glance');
        
        // Key statistics
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', summaryY + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`${totalYears} years of data spanning ${firstYear}-${lastYear} | Five transformative periods | From medieval agriculture to modern services`);
    }
    
    getMetricLabel(metric) {
        const labels = {
            'gdpReal': 'Real GDP (£M)',
            'population': 'Population (millions)',
            'cpi': 'Consumer Price Index',
            'wages': 'Real Wages',
            'unemployment': 'Unemployment Rate (%)',
            'interest_rates': 'Interest Rate (%)'
        };
        return labels[metric] || metric;
    }
    
    addDualAxisChart(populationData, gdpData) {
        console.log('📊 Adding dual axis chart with GDP and Population...');
        
        // Use the same reduced chart height as the main chart
        const chartHeight = this.height * 0.9; // Match the reduced chart height
        
        // Create secondary Y-axis for population (right side)
        const populationYScale = d3.scaleLog()
            .domain([d3.min(populationData, d => d.value), d3.max(populationData, d => d.value) * 1.1])
            .range([chartHeight, 0]) // Use reduced chart height
            .nice();
        
        // Add secondary Y-axis (right side)
        const populationYAxis = d3.axisRight(populationYScale)
            .tickFormat(d => d3.format('.1f')(d / 1000) + 'M') // Show in millions
            .ticks(6);
        
        this.sceneGroup.append('g')
            .attr('class', 'population-y-axis')
            .attr('transform', `translate(${this.width}, 0)`)
            .call(populationYAxis);
        
        // Add population Y-axis label
        this.sceneGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', this.width + 40)
            .attr('x', -chartHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#e74c3c')
            .text('Population (millions, log scale)');
        
        // Create population line generator
        const populationLine = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => populationYScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Add population trend line
        this.sceneGroup.append('path')
            .datum(populationData)
            .attr('class', 'population-trend-line')
            .attr('fill', 'none')
            .attr('stroke', '#e74c3c')
            .attr('stroke-width', 4) // Thick line
            .attr('d', populationLine)
            .style('opacity', 0.8);
        
        // Add population data points
        this.sceneGroup.selectAll('.population-data-point')
            .data(populationData.filter((d, i) => i % 5 === 0)) // Show every 5th point
            .enter().append('circle')
            .attr('class', 'population-data-point')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => populationYScale(d.value))
            .attr('r', 4) // Large points
            .attr('fill', '#e74c3c')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                // Show population tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0,0,0,0.8)')
                    .style('color', 'white')
                    .style('padding', '8px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('z-index', 1000);
                
                tooltip.html(`
                    <strong>Population</strong><br/>
                    Year: ${d.year}<br/>
                    Population: ${d3.format('.1f')(d.value / 1000)} million
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                d3.selectAll('.tooltip').remove();
            });
    }
    
    exit() {
        console.log('🔄 Scene 6 - Exit called');
        return new Promise((resolve) => {
            this.sceneGroup.selectAll('*')
                .transition()
                .duration(500)
                .style('opacity', 0)
                .on('end', resolve);
        });
    }
}