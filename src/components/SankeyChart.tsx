import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-selection';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { scaleOrdinal } from 'd3-scale';

interface SankeyProps {
  data: {
    from: string;
    to: string;
    amount: number;
  }[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  nodeColors?: string[];
  linkOpacity?: number;
  containerClassName?: string;
  textColor?: string;
}

interface SankeyNodeExtra {
  name: string;
}

interface SankeyLinkExtra {
  value: number;
}

type Node = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type Link = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;

const defaultNodeColors = [
  'hsl(0, 0%, 90%)',
];

const formatValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Function to determine if we should use mobile layout
const shouldUseMobileLayout = (width: number) => width < 640;

export default function SankeyChart({ 
  data, 
  width: initialWidth = 800, 
  height: initialHeight = 500,
  backgroundColor = 'emphasized-element',
  nodeColors = defaultNodeColors,
  linkOpacity = 0.3,
  containerClassName = '',
  textColor = 'hsl(0, 0%, 100%)' // Default to white text
}: SankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = Math.min(containerRef.current.offsetWidth, 1200); // Max width of 1200px
        const isMobileView = shouldUseMobileLayout(containerWidth);
        setIsMobile(isMobileView);
        setIsVerySmallScreen(containerWidth < 375);
        
        // Calculate height based on width while maintaining aspect ratio
        let containerHeight;
        if (isMobileView) {
          containerHeight = Math.max(500, containerWidth * 1.2); // Taller for mobile
        } else {
          // For desktop, cap the height
          containerHeight = Math.min(
            Math.max(400, containerWidth * 0.5), // Standard ratio
            700 // Maximum height
          );
        }
        
        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length || isVerySmallScreen) return;

    const { width, height } = dimensions;

    // Clear any existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Consistent margins across all screen sizes with minimum values
    const margin = {
      top: Math.max(20, height * 0.05),
      right: Math.max(120, width * 0.2), // Increased right margin for all screens
      bottom: Math.max(20, height * 0.05),
      left: Math.max(100, width * 0.15)  // Increased left margin for all screens
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Process the data for sankey
    const nodeNames = Array.from(new Set([...data.map(d => d.from), ...data.map(d => d.to)]));
    const nodes: Node[] = nodeNames.map(name => ({ name }));
    const nodeMap = new Map(nodeNames.map((name, i) => [name, i]));

    // Create links
    const links: Link[] = data.map(d => ({
      source: nodeMap.get(d.from)!,
      target: nodeMap.get(d.to)!,
      value: d.amount
    }));

    // Create the sankey generator with adjusted settings
    const sankeyGenerator = sankey<SankeyNodeExtra, SankeyLinkExtra>()
      .nodeWidth(isMobile ? Math.max(10, width * 0.03) : Math.max(15, width * 0.02)) // Thinner nodes on mobile
      .nodePadding(isMobile ? Math.max(15, height * 0.02) : Math.max(10, height * 0.03))
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Generate the sankey data
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes,
      links: links
    });

    // Create the SVG with proper margins
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color scale using provided colors
    const colorScale = scaleOrdinal<string>()
      .domain(nodeNames)
      .range(nodeColors);

    // Create tooltip with improved contrast
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'absolute hidden p-3 bg-black/90 rounded-lg shadow-lg text-white text-sm max-w-[300px] z-50')
      .style('pointer-events', 'none');

    // Add links with gradient definitions
    const defs = svg.append('defs');
    
    sankeyLinks.forEach((d, i) => {
      const gradientId = `gradient-${i}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', ((d.source as Node).x1 || 0).toString())
        .attr('x2', ((d.target as Node).x0 || 0).toString());

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorScale((d.source as Node).name));

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorScale((d.target as Node).name));
    });

    // Add links
    svg.append('g')
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d, i) => `url(#gradient-${i})`)
      .attr('stroke-width', d => Math.max(1, d.width || 0))
      .attr('fill', 'none')
      .attr('opacity', linkOpacity)
      .on('mouseover', (event, d) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .attr('class', 'absolute p-3 bg-black/90 rounded-lg shadow-lg text-white text-sm max-w-[300px] z-50')
          .html(`
            <div class="font-medium">${(d.source as Node).name} → ${(d.target as Node).name}</div>
            <div class="opacity-80">${formatValue(d.value)}</div>
          `);
      })
      .on('mouseout', () => {
        tooltip.attr('class', 'absolute hidden p-3 bg-black/90 rounded-lg shadow-lg text-white text-sm max-w-[300px] z-50');
      });

    // Add nodes
    const nodes_g = svg.append('g')
      .selectAll('g')
      .data(sankeyNodes)
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles for nodes
    nodes_g.append('rect')
      .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', d => colorScale(d.name))
      .attr('opacity', 0.8)
      .attr('rx', 2)
      .attr('ry', 2)
      .on('mouseover', (event, d) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .attr('class', 'absolute p-3 bg-black/90 rounded-lg shadow-lg text-white text-sm max-w-[300px] z-50')
          .html(`
            <div class="font-medium">${d.name}</div>
            <div class="opacity-80">Total: ${formatValue(d.value!)}</div>
          `);
      })
      .on('mouseout', () => {
        tooltip.attr('class', 'absolute hidden p-3 bg-black/90 rounded-lg shadow-lg text-white text-sm max-w-[300px] z-50');
      });

    // Calculate font size based on available space
    const fontSize = Math.max(10, Math.min(14, width * 0.01)); // Consistent font sizing

    // Add labels with improved readability and positioning
    nodes_g.append('text')
      .attr('x', d => {
        const isLeftSide = (d.x0 || 0) < innerWidth / 2;
        // More generous padding for text
        if (isLeftSide) {
          return -16; // Increased left padding
        } else {
          return ((d.x1 || 0) - (d.x0 || 0)) + 16; // Increased right padding
        }
      })
      .attr('y', d => ((d.y1 || 0) - (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 || 0) < innerWidth / 2 ? 'end' : 'start')
      .attr('fill', textColor)
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '500')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.2)')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.name.split(/\s+/);
        
        // Calculate available width for text based on position
        const availableWidth = Math.min(
          margin.left * 0.8, // Use 80% of the margin width
          margin.right * 0.8
        );
        
        // Calculate max chars based on available width and font size
        const avgCharWidth = fontSize * 0.6; // Approximate width per character
        const maxCharsPerLine = Math.floor(availableWidth / avgCharWidth);
        
        // Always wrap if more than 2 words or longer than maxCharsPerLine
        if (words.length > 2 || d.name.length > maxCharsPerLine) {
          text.text('');
          
          // Split into multiple lines if needed
          let lines: string[] = [];
          let currentLine: string[] = [];
          let currentLength = 0;
          
          words.forEach(word => {
            if (currentLength + word.length > maxCharsPerLine) {
              if (currentLine.length > 0) {
                lines.push(currentLine.join(' '));
                currentLine = [word];
                currentLength = word.length;
              } else {
                // If a single word is too long, split it
                const firstPart = word.slice(0, maxCharsPerLine - 1) + '-';
                lines.push(firstPart);
                const remainingPart = word.slice(maxCharsPerLine - 1);
                if (remainingPart) {
                  currentLine = [remainingPart];
                  currentLength = remainingPart.length;
                }
              }
            } else {
              currentLine.push(word);
              currentLength += word.length + 1;
            }
          });
          
          if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
          }

          // Add lines with proper positioning
          const isLeftSide = (d.x0 || 0) < innerWidth / 2;
          const xPosition = isLeftSide ? -16 : ((d.x1 || 0) - (d.x0 || 0)) + 16;
          
          lines.forEach((line, i) => {
            text.append('tspan')
              .attr('x', xPosition)
              .attr('dy', i === 0 ? `-${(lines.length - 1) * 0.6}em` : '1.2em')
              .text(line);
          });
        } else {
          text.text(d.name);
        }
      });

    return () => {
      tooltip.remove();
    };
  }, [data, dimensions, backgroundColor, nodeColors, linkOpacity, textColor, isMobile, isVerySmallScreen]);

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg p-4 shadow-sm ${containerClassName}`}
      style={{ backgroundColor }}
    >
      {isVerySmallScreen ? (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md bg-black/20"
              style={{ color: textColor }}
            >
              <div className="font-medium">{item.from} → {item.to}</div>
              <div className="opacity-80 text-sm">{formatValue(item.amount)}</div>
            </div>
          ))}
        </div>
      ) : (
        <svg ref={svgRef} className="w-full h-full" />
      )}
    </div>
  );
}