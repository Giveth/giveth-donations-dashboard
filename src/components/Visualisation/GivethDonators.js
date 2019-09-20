import React from 'react';
import * as d3 from 'd3';

const GivethDonators = ({donationData}) => {

    // const [giverNodes, setGiverNodes] = React.useState([]);
    // const [donationLinks, setDonationLinks] = React.useState([]);
    // const [donationTotal, setDonationTotal] = React.useState(0);

    React.useEffect(() => {
        console.log("Mounted");
        console.log(donationData)
        createNodesAndLinks();
    }, []);

    const createNodesAndLinks = () => {
        let includedGiverIds = [];
        let nodes = [];
        let links = [];
        let runningTotal = 0
        donationData.map(donation => {
            if (!includedGiverIds.includes(donation.giverId)) {
                nodes.push({"id": donation.giverId})
                includedGiverIds.push(donation.giverId)
            }
            if (!includedGiverIds.includes(donation.receiverId)) {
                nodes.push({"id": donation.receiverId})
                includedGiverIds.push(donation.receiverId)

            }
            links.push({"source": donation.giverId, "target": donation.receiverId, "amount": donation.amount})
            runningTotal += donation.amount / 10**18;
        })

        drawChart(nodes, links, runningTotal)
        console.log(runningTotal)
    }



    const drawChart = (nodes, links, donationTotal) => {
        const height = 1000;
        const width = 1000;
        const nodeRadius = 20;

        console.log(nodes);
        console.log(links)

        const svg = d3.select("#d3-container").append("svg").attr("width", width).attr("height", height);

        const containingG = svg.append("g");



        let drag_handler = d3.drag()
            .on("start", dragStart)
            .on("drag", dragDrag)
            .on("end", dragEnd);

        let zoomHandler = d3.zoom()
            .on("zoom", zoom_actions);

        drag_handler(containingG);

        zoomHandler(svg);


        const simulation = d3.forceSimulation()
            .nodes(nodes);

        //Create the link force
        //We need the id accessor to use named sources and targets
        let linkForce =  d3.forceLink(links)
            .id(function(d) { return d.id; })
            .distance(60)
            .strength(0.7);

        let chargeForce = d3.forceManyBody().strength(-100).distanceMax(400)

        let collisionForce = d3.forceCollide(nodeRadius + 10)

        simulation
            .force("charge_force", d3.forceManyBody())
            .force("center_force", d3.forceCenter(width / 2, height / 2))
            .force("links",linkForce)
            .force("collision", collisionForce)
            .force("charge", chargeForce);



        //draw lines for the links
        let link = containingG.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                const strokeWidth =  d.amount / 10**18 /donationTotal * 100
                console.log(strokeWidth);

                return strokeWidth > 2 ? strokeWidth : 2
            })
            .attr("fill", "blue");

        let linkText = containingG.append("g")
            .selectAll("text")
            .data(links)
            .enter()
            .append("text");


        let linkTextLabels = linkText
            .attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
            .attr("y", function(d) { return (d.source.y + d.target.y) / 2 })
            .text(function(d) {return ""})
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px");
            // .attr("fill", "black");

        let node = containingG.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", nodeRadius)
            .attr("fill", "red");


        let nodeText = containingG.append("g")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text");

        let nodeTextLabels = nodeText
            .attr("x", function(d) { return (d.x)})
            .attr("y", function(d) { return (d.y) })
            .text(function(d) {return d.id})
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black");

        function tickActions() {
            //update circle positions each tick of the simulation
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            //update link positions
            //simply tells one end of the line to follow one node around
            //and the other end of the line to follow the other node around
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodeTextLabels
                .attr("x", function(d) { return (d.x)})
                .attr("y", function(d) { return (d.y) })

            linkTextLabels
                .attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
                .attr("y", function(d) { return (d.source.y + d.target.y) / 2 })

        }


        const dragStart = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragDrag = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        const dragEnd = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        function zoom_actions(){
            containingG.attr("transform", d3.event.transform)
        }



        simulation.on("tick", tickActions );

    };

    return (
     <div id='d3-container'></div>
    )
}

export default GivethDonators;
