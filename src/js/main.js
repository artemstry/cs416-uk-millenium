/**
 * UK Economic Millennium Story - Main Application
 * Interactive narrative visualization using D3.js
 */

import { dataProcessor } from './data/DataProcessor.js';
import { Scene1Medieval } from './scenes/Scene1Medieval.js';
import { Scene2GreatAwakening } from './scenes/Scene2GreatAwakening.js';
import { Scene3Industrial } from './scenes/Scene3Industrial.js';
import { Scene4Crisis } from './scenes/Scene4Crisis.js';
import { Scene5Modern } from './scenes/Scene5Modern.js';
import { Scene6Interactive } from './scenes/Scene6Interactive.js';

class NarrativeVisualization {
    constructor() {
        this.currentScene = 1;
        this.data = null;
        this.dataProcessor = dataProcessor;
        this.svg = null;
        this.parameters = {
            timeRange: [1209, 2016],
            selectedIndicators: ['gdpReal', 'population', 'cpi'],
            viewMode: 'absolute',
            width: 1000,
            height: 700, // Increased height to accommodate economic structure
            margin: { top: 40, right: 20, bottom: 40, left: 60 }
        };
        
        // Updated 6-scene structure based on our narrative proposal
        this.scenes = [
            { id: 1, title: 'Medieval Times', period: '1209-1500', class: Scene1Medieval, icon: 'fa-landmark' },
            { id: 2, title: 'Great Awakening', period: '1500-1750', class: Scene2GreatAwakening, icon: 'fa-ship' },
            { id: 3, title: 'Industrial Explosion', period: '1750-1900', class: Scene3Industrial, icon: 'fa-industry' },
            { id: 4, title: 'Crisis & Transformation', period: '1900-1950', class: Scene4Crisis, icon: 'fa-shield-alt' },
            { id: 5, title: 'Modern Service Economy', period: '1950-2016', class: Scene5Modern, icon: 'fa-chart-line' },
            { id: 6, title: 'Interactive Exploration', period: 'All Periods', class: Scene6Interactive, icon: 'fa-compass' }
        ];
        
        this.sceneInstances = {};
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing UK Economic Millennium Story...');
            
            // Setup the visualization container
            this.setupVisualizationContainer();
            
            // Setup navigation
            this.setupNavigation();
            
            // Load data and wait for it to complete
            await this.loadData();
            
            // Render first scene (now data is guaranteed to be loaded)
            this.renderScene(this.currentScene);
            
            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize visualization. Please check the console for details.');
        }
    }
    
    setupVisualizationContainer() {
        const container = d3.select('#visualization-container');
        
        // Clear loading message
        container.select('#loading').remove();
        
        // Create SVG container
        this.svg = container
            .append('svg')
            .attr('width', this.parameters.width)
            .attr('height', this.parameters.height)
            .attr('viewBox', `0 0 ${this.parameters.width} ${this.parameters.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        // Add navigation arrows
        this.addNavigationArrows();
        
        // Remove redundant title - we already have a large header
    }
    
    setupNavigation() {
        const nav = d3.select('#scene-navigation');
        
        nav.selectAll('.nav-button')
            .data(this.scenes)
            .enter()
            .append('button')
            .attr('class', (d, i) => `nav-button ${i === 0 ? 'active' : ''}`)
            .attr('data-scene', d => d.id)
            .on('click', (event, d) => {
                this.navigateToScene(d.id);
            })
            .html(d => `<i class="fas ${d.icon}"></i><span>${d.title} (${d.period})</span>`);
    }
    
    addNavigationArrows() {
        const arrowSize = 60;
        const arrowY = 50; // Moved to top of chart
        const leftX = 20; // Fixed: moved back to visible position
        const rightX = this.parameters.width - 30;
        
        // Left arrow (previous scene) - only create for scenes 2-6
        if (this.currentScene !== 1) {
            this.svg.append('g')
                .attr('class', 'nav-arrow left-arrow')
                .style('cursor', 'pointer')
                .on('click', () => this.previousScene())
                .on('mouseover', function() {
                    d3.select(this).style('opacity', 0.8);
                })
                .on('mouseout', function() {
                    d3.select(this).style('opacity', 1);
                });
                
            this.svg.select('.left-arrow')
                .append('text')
                .attr('x', leftX)
                .attr('y', arrowY + 15)
                .attr('text-anchor', 'middle')
                .attr('font-size', '48px')
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text('‹');
        }
        
        // Right arrow (next scene) - only create for scenes 1-5
        if (this.currentScene !== 6) {
            this.svg.append('g')
                .attr('class', 'nav-arrow right-arrow')
                .style('cursor', 'pointer')
                .on('click', () => this.nextScene())
                .on('mouseover', function() {
                    d3.select(this).style('opacity', 0.8);
                })
                .on('mouseout', function() {
                    d3.select(this).style('opacity', 1);
                });
                
            this.svg.select('.right-arrow')
                .append('text')
                .attr('x', rightX)
                .attr('y', arrowY + 15)
                .attr('text-anchor', 'middle')
                .attr('font-size', '48px')
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text('›');
        }
    }
    
    async loadData() {
        console.log('📊 Loading UK Millennium Dataset...');
        
        try {
            // Load and process the real data using our DataProcessor
            this.data = await this.dataProcessor.loadData();
            
            console.log('✅ Data loaded successfully!');
            console.log(`📈 Data Summary:`, this.data.summary);
            console.log(`🏛️ Periods available:`, Object.keys(this.data.periods));
            
            // Log some key statistics
            if (this.data.summary.dramaticChanges.length > 0) {
                console.log('🎯 Most Dramatic Changes:');
                this.data.summary.dramaticChanges.forEach(change => {
                    console.log(`   ${change.description}`);
                });
            }
            
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            throw error;
        }
    }
    
    navigateToScene(sceneId) {
        if (sceneId === this.currentScene) return;
        
        // Update navigation
        d3.selectAll('.nav-button')
            .classed('active', false);
        d3.select(`[data-scene="${sceneId}"]`)
            .classed('active', true);
        
        // Update current scene
        this.currentScene = sceneId;
        
        // Update arrow visibility
        this.updateArrowVisibility();
        
        // Render new scene
        this.renderScene(sceneId);
        
        console.log(`📍 Navigated to Scene ${sceneId}`);
    }
    
    previousScene() {
        const newScene = this.currentScene > 1 ? this.currentScene - 1 : this.scenes.length;
        this.navigateToScene(newScene);
    }
    
    nextScene() {
        const newScene = this.currentScene < this.scenes.length ? this.currentScene + 1 : 1;
        this.navigateToScene(newScene);
    }
    
    updateArrowVisibility() {
        // Remove existing arrows
        d3.selectAll('.nav-arrow').remove();
        
        // Recreate arrows based on current scene
        this.addNavigationArrows();
    }
    
    renderScene(sceneId) {
        console.log(`🎬 Rendering Scene ${sceneId}...`);
        
        // Clear previous scene
        this.svg.selectAll('.scene-content').remove();
        
        // Create scene group
        const sceneGroup = this.svg.append('g')
            .attr('class', 'scene-content');
        
        // Update annotation panel
        this.updateAnnotations(sceneId);
        
        // Find the scene configuration
        const sceneConfig = this.scenes.find(s => s.id === sceneId);
        if (!sceneConfig) {
            console.error(`❌ Scene ${sceneId} not found`);
            return;
        }
        
        // Render scene using dedicated scene class or fallback - PROTECTED WITH TRY/CATCH
        if (sceneConfig.class) {
            try {
                // Use dedicated scene class
                const SceneClass = sceneConfig.class;
                const sceneInstance = new SceneClass(sceneGroup, this.data, this.parameters);
                this.sceneInstances[sceneId] = sceneInstance;
                sceneInstance.render();
                
                console.log(`✅ Scene ${sceneId} (${sceneConfig.title}) rendered successfully`);
            } catch (error) {
                console.error(`🚨 Error rendering scene ${sceneId} (${sceneConfig.title}):`, error);
                
                // Show error message instead of breaking everything
                sceneGroup.append('text')
                    .attr('x', this.parameters.width / 2)
                    .attr('y', this.parameters.height / 2)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '18px')
                    .style('fill', 'red')
                    .text(`⚠️ Error loading ${sceneConfig.title}`);
                    
                sceneGroup.append('text')
                    .attr('x', this.parameters.width / 2)
                    .attr('y', this.parameters.height / 2 + 30)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('fill', '#666')
                    .text('Check console for details. Other scenes should work.');
            }
        } else {
            // Fallback to placeholder for scenes not yet implemented
            this.renderPlaceholder(sceneGroup, `${sceneConfig.title} (${sceneConfig.period})`);
        }
    }
    

    
    renderPlaceholder(group, title = 'Coming Soon') {
        const centerX = (this.parameters.width - this.parameters.margin.left - this.parameters.margin.right) / 2;
        const centerY = (this.parameters.height - this.parameters.margin.top - this.parameters.margin.bottom) / 2;
        
        group.append('text')
            .attr('x', centerX)
            .attr('y', centerY)
            .attr('text-anchor', 'middle')
            .style('font-size', '24px')
            .style('fill', '#999')
            .text(title);
        
        group.append('text')
            .attr('x', centerX)
            .attr('y', centerY + 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('Add your UK macroeconomic data to see visualization');
    }
    
    updateAnnotations(sceneId) {
        const annotationPanel = d3.select('#annotation-panel');
        
        // Clear existing annotations
        annotationPanel.selectAll('.annotation').remove();
        
        // Add scene-specific annotations
        const annotations = this.getAnnotationsForScene(sceneId);
        
        const annotationDivs = annotationPanel
            .selectAll('.annotation')
            .data(annotations)
            .enter()
            .append('div')
            .attr('class', 'annotation');
        
        annotationDivs.append('h3')
            .text(d => d.title);
        
        annotationDivs.append('div')
            .attr('class', 'annotation-content')
            .html(d => d.content || d.text);
    }
    
    getAnnotationsForScene(sceneId) {
        // Get actual data statistics if available
        const dataStats = this.data?.periods || {};
        
        const annotationData = {
            1: [
                {
                    title: 'Medieval Times',
                    content: 'For centuries, England\'s economy remained locked in medieval patterns with sparse data, agricultural dominance, and extreme volatility from famines and plagues. The <a href="https://en.wikipedia.org/wiki/Medieval_demography" target="_blank">medieval demographic cycle</a> saw repeated population crashes and recoveries.'
                },
                {
                    title: 'Population Stagnation',
                    content: `Population grew very slowly from ~3.6M to ~4.3M over 300 years. The <a href="https://en.wikipedia.org/wiki/Black_Death" target="_blank">Black Death (1348)</a> devastated the population by 30-40%, creating labor shortages that eventually led to the end of serfdom.`
                },
                {
                    title: 'Economic Structure',
                    content: `Medieval economy dominated by <a href="https://en.wikipedia.org/wiki/Medieval_agriculture" target="_blank">agriculture (70-85%)</a>, with emerging crafts & trade sectors. Service economy minimal, limited to basic commerce and religious institutions.`
                }
            ],
            2: [
                {
                    title: 'The Great Awakening',
                    content: 'The <a href="https://en.wikipedia.org/wiki/Renaissance" target="_blank">Renaissance</a> brought economic dynamism - population surged, trade expanded, and financial innovations emerged. The <a href="https://en.wikipedia.org/wiki/Age_of_Discovery" target="_blank">Age of Discovery</a> opened global trade routes.'
                },
                {
                    title: 'Financial Innovation',
                    content: '<a href="https://en.wikipedia.org/wiki/Bank_of_England" target="_blank">Bank of England</a> founded (1694), <a href="https://en.wikipedia.org/wiki/Stock_market" target="_blank">stock markets</a> emerge, interest rates fall from 10%+ to 3-5%. The <a href="https://en.wikipedia.org/wiki/Financial_Revolution" target="_blank">Financial Revolution</a> created modern banking.'
                },
                {
                    title: 'GDP Acceleration',
                    content: 'England GDP grows from £2.6M to £10.7M - 4x growth in 250 years, setting stage for <a href="https://en.wikipedia.org/wiki/Industrial_Revolution" target="_blank">industrial revolution</a>. Population doubles from 4M to 8M.'
                }
            ],
            3: [
                {
                    title: 'Industrial Explosion',
                    content: 'The <a href="https://en.wikipedia.org/wiki/Industrial_Revolution" target="_blank">Industrial Revolution</a> created sustained economic growth for the first time in human history. <a href="https://en.wikipedia.org/wiki/Steam_engine" target="_blank">Steam power</a> and <a href="https://en.wikipedia.org/wiki/Factory_system" target="_blank">factory system</a> revolutionized production.'
                },
                {
                    title: 'Exponential Growth',
                    content: 'Real GDP explodes 20x from £10M to £200M. Population quadruples with massive <a href="https://en.wikipedia.org/wiki/Urbanization" target="_blank">urbanization</a>. <a href="https://en.wikipedia.org/wiki/Railway_manias" target="_blank">Railway manias</a> and infrastructure boom.'
                },
                {
                    title: 'Modern Economy Born',
                    content: 'Shift from 80% agricultural to 20% agricultural employment. <a href="https://en.wikipedia.org/wiki/Real_wage" target="_blank">Real wages</a> rise for first time in centuries. <a href="https://en.wikipedia.org/wiki/Middle_class" target="_blank">Middle class</a> emerges.'
                }
            ],
            4: [
                {
                    title: 'Crisis & Transformation',
                    content: 'Two <a href="https://en.wikipedia.org/wiki/World_War_I" target="_blank">world wars</a> and the <a href="https://en.wikipedia.org/wiki/Great_Depression" target="_blank">Great Depression</a> shattered the old economic order, birthing the modern state. <a href="https://en.wikipedia.org/wiki/Keynesian_economics" target="_blank">Keynesian economics</a> emerges.'
                },
                {
                    title: 'Big Government',
                    content: 'Government spending explodes from 10% to 40%+ of GDP during wars. <a href="https://en.wikipedia.org/wiki/Unemployment" target="_blank">Unemployment</a> peaks at 15%+ in 1930s. <a href="https://en.wikipedia.org/wiki/Welfare_state" target="_blank">Welfare state</a> established.'
                },
                {
                    title: 'New Economic Order',
                    content: '<a href="https://en.wikipedia.org/wiki/Gold_standard" target="_blank">Gold standard</a> abandoned, modern economic management emerges. <a href="https://en.wikipedia.org/wiki/Bretton_Woods_system" target="_blank">Bretton Woods</a> creates new monetary order.'
                }
            ],
            5: [
                {
                    title: 'Modern Service Economy',
                    content: 'Britain transforms from industrial powerhouse to <a href="https://en.wikipedia.org/wiki/Service_economy" target="_blank">service economy</a>, bringing new prosperity and financial risks. <a href="https://en.wikipedia.org/wiki/Thatcherism" target="_blank">Thatcher reforms</a> accelerate transition.'
                },
                {
                    title: 'Service Dominance',
                    content: 'Services grow from 40% to 80% of economy. <a href="https://en.wikipedia.org/wiki/Financial_services" target="_blank">Financial sector</a> profits surge as manufacturing declines. <a href="https://en.wikipedia.org/wiki/Big_Bang_(financial_markets)" target="_blank">Big Bang</a> deregulation (1986).'
                },
                {
                    title: 'Asset Inflation',
                    content: '<a href="https://en.wikipedia.org/wiki/House_price_index" target="_blank">House prices</a> explode 100x since 1950, while wages rise only 10x. <a href="https://en.wikipedia.org/wiki/Consumer_debt" target="_blank">Consumer debt</a> mountains accumulate. <a href="https://en.wikipedia.org/wiki/Financial_crisis_of_2007%E2%80%9308" target="_blank">2008 crisis</a> exposes risks.'
                }
            ],
            6: [
                {
                    title: 'Interactive Exploration',
                    content: 'Explore 1000+ years of UK economic data to discover patterns, correlations, and long-term trends. <a href="https://en.wikipedia.org/wiki/Data_visualization" target="_blank">Data visualization</a> reveals hidden economic cycles.'
                },
                {
                    title: 'Historical Context',
                    content: 'Compare different time periods, analyze crisis impacts, and understand how past events shaped modern Britain. <a href="https://en.wikipedia.org/wiki/Economic_history" target="_blank">Economic history</a> provides crucial lessons.'
                },
                {
                    title: 'Data Insights',
                    content: `${this.data?.summary?.dramaticChanges?.[0]?.description || 'Discover dramatic transformations in UK economic history.'} <a href="https://en.wikipedia.org/wiki/Macroeconomic_data" target="_blank">Macroeconomic data</a> from <a href="https://en.wikipedia.org/wiki/Bank_of_England" target="_blank">Bank of England</a>.`
                }
            ]
        };
        
        return annotationData[sceneId] || [];
    }
    
    showError(message) {
        const container = d3.select('#visualization-container');
        container.html('')
            .append('div')
            .style('text-align', 'center')
            .style('padding', '2rem')
            .style('color', 'red')
            .html(`<h3>Error</h3><p>${message}</p>`);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, starting application...');
    new NarrativeVisualization();
});

// Add some debugging helpers
window.debugViz = {
    app: null,
    data: null,
    d3: d3
};

console.log('📝 Main.js loaded - Ready for UK Economic Millennium Story!');