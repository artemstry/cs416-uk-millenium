/**
 * Scene 6: Interactive Exploration (All Periods)
 * Allows users to explore the full millennium dataset interactively
 * USING SAME APPROACH AS SCENE 1 BUT WITH INTERACTIVE CONTROLS
 */

export class Scene6Interactive {
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = 1000;
        
        // All period data combined (with null safety)
        if (!data) {
            console.error('❌ Scene6Interactive: Data not loaded yet!', data);
            throw new Error('Data not available for Interactive scene. Please wait for data to load.');
        }
        
        // Try different data sources to get the full dataset
        if (data.raw) {
            this.allData = data.raw;
        } else if (data.enriched) {
            this.allData = data.enriched;
        } else if (data.periods) {
            this.allData = Object.values(data.periods).flatMap(period => period.data);
        } else {
            console.error('❌ Scene6Interactive: No valid data source found!', data);
            throw new Error('No valid data source found for Interactive scene.');
        }
        
        // Chart dimensions - same as Scene 1
        this.margin = { top: 120, right: 80, bottom: 120, left: 100 }; // Extra bottom margin for controls
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        // Interactive state (following Scene 1 pattern)
        this.selectedMetric = 'gdpReal';
        this.selectedPeriod = 'all';
        this.showPopulation = true;
        
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
        
        // Chart setup - use entire vertical space, remove millennium summary
        const chartHeight = this.height + 50; // Make Y-axis 50+ pixels taller
        
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
        // Key events from across all periods
        const historicalEvents = [
            // Medieval
            { year: 1348, event: 'Black Death', story: 'Plague devastates population, reshaping economy and society', economicEffect: 'Labor scarcity drives wage increases and social change', impact: 'devastating', y: 80 },
            // Great Awakening
            { year: 1600, event: 'East India Company', story: 'Joint-stock company pioneers modern corporate structure', economicEffect: 'Global trade expansion and capital accumulation', impact: 'positive', y: 100 },
            // Industrial
            { year: 1825, event: 'First Railway', story: 'Railway age begins, revolutionizing transport and trade', economicEffect: 'Reduced costs, mass markets, industrial growth', impact: 'positive', y: 70 },
            // Crisis
            { year: 1929, event: 'Great Depression', story: 'Global economic collapse challenges existing theories', economicEffect: 'Mass unemployment, government intervention required', impact: 'devastating', y: 90 },
            // Modern
            { year: 1990, event: 'World Wide Web', story: 'Internet revolution transforms global economy', economicEffect: 'Digital services, globalization, productivity growth', impact: 'positive', y: 110 }
        ];
        
        // Filter events that fall within our data range
        const relevantEvents = historicalEvents.filter(event => {
            const domain = this.xScale.domain();
            return event.year >= domain[0] && event.year <= domain[1];
        });
        
        // Add event markers
        const eventGroup = this.sceneGroup.selectAll('.historical-event')
            .data(relevantEvents)
            .enter().append('g')
            .attr('class', 'historical-event')
            .style('cursor', 'pointer');
        
        // Event circles
        eventGroup.append('circle')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => d.y)
            .attr('r', 6) // Smaller for overview
            .attr('fill', d => this.getEventColor(d.impact))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('opacity', 0.9);
        
        // Event labels
        eventGroup.append('text')
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => d.y - 12)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text(d => d.event);
        
        // Add interactivity - click only, no tooltip on hover
        eventGroup
            .on('click', (event, d) => this.showEventStory(d));
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
    
    getEventColor(impact) {
        const colors = {
            'devastating': '#d32f2f',
            'social': '#f57c00',
            'recovery': '#388e3c',
            'positive': '#1976d2'
        };
        return colors[impact] || '#666';
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
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', '2px solid white')
            .style('max-width', '250px')
            .style('line-height', '1.4');
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 6px;">${historicalEvent.year} - ${historicalEvent.event}</div>`;
        tooltipContent += `<div style="margin-bottom: 8px; font-size: 12px;">${historicalEvent.story}</div>`;
        tooltipContent += `<div style="font-size: 11px; font-style: italic; opacity: 0.9;">Impact: ${historicalEvent.economicEffect}</div>`;
        tooltipContent += `<div style="text-align: center; margin-top: 6px; font-size: 10px; opacity: 0.8;">Click event marker for full story</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 270) + 'px')
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
        const breakdownY = this.height + 80;  // Position below the taller chart
        
        // Get the full data range
        const availableYears = this.allData
            .filter(d => d.population !== null || d.gdpReal !== null)
            .map(d => d.year);
        
        if (availableYears.length === 0) return;
        
        const actualStartYear = Math.min(...availableYears);
        const actualEndYear = Math.max(...availableYears);
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([actualStartYear - 10, Math.max(actualEndYear + 10, 2016)])
            .range([0, this.width]);
        
        // Create a single fluid industry visualization - taller and more detailed
        const fluidHeight = 100;  // 50% taller
        
        // Create time-based data points - every 5 years for stable tooltips
        const timePoints = [];
        for (let year = actualStartYear; year <= actualEndYear; year += 5) {
            timePoints.push({
                year: year,
                agriculture: this.getIndustryPercentage(year, 'agriculture'),
                manufacturing: this.getIndustryPercentage(year, 'manufacturing'),
                services: this.getIndustryPercentage(year, 'services')
            });
        }
        
        // Add final year if not included
        if ((actualEndYear - actualStartYear) % 5 !== 0) {
            const finalYear = actualEndYear;
            timePoints.push({
                year: finalYear,
                agriculture: this.getIndustryPercentage(finalYear, 'agriculture'),
                manufacturing: this.getIndustryPercentage(finalYear, 'manufacturing'),
                services: this.getIndustryPercentage(finalYear, 'services')
            });
        }
        
        // Create stacked area chart using D3's stack generator
        const stack = d3.stack()
            .keys(['agriculture', 'manufacturing', 'services']);
        
        const stackedData = stack(timePoints);
        
        // Create area generator
        const area = d3.area()
            .x(d => xScale(d.data.year))
            .y0(d => breakdownY + fluidHeight - (d[0] / 100) * fluidHeight)
            .y1(d => breakdownY + fluidHeight - (d[1] / 100) * fluidHeight)
            .curve(d3.curveBasis);
        
        // Industry group container
        const industryGroup = this.sceneGroup.append('g')
            .attr('class', 'industry-breakdown');
        
        // Draw each industry layer with consistent colors from Scene 1
        const industryNames = ['agriculture', 'manufacturing', 'services'];
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
        // Full millennium industry evolution
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
                case 'agriculture': return 5 - (progress * 4); // 5% → 1%
                case 'manufacturing': return 50 - (progress * 38); // 50% → 12%
                case 'services': return 45 + (progress * 42); // 45% → 87%
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
            .style('border', `3px solid ${this.getEventColor(event.impact)}`)
            .style('max-width', '500px')
            .style('text-align', 'center');
        
        tooltip.html(`
            <div style="border-bottom: 2px solid ${this.getEventColor(event.impact)}; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="color: ${this.getEventColor(event.impact)}; margin: 0; font-size: 24px;">${event.year}</h2>
                <h3 style="margin: 4px 0 0 0; color: #d4a574;">${event.event}</h3>
            </div>
            <div style="text-align: left; line-height: 1.6; margin-bottom: 16px;">
                <p>${event.story}</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: left;">
                <strong style="color: #FFB74D;">Economic Impact:</strong><br/>
                ${event.economicEffect}
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
            .text('Interactive exploration data is being processed...');
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
        
        // Create secondary Y-axis for population (right side)
        const populationYScale = d3.scaleLog()
            .domain([d3.min(populationData, d => d.value), d3.max(populationData, d => d.value) * 1.1])
            .range([this.height + 50, 0]) // Match the chart height
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
            .attr('x', -(this.height + 50) / 2)
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